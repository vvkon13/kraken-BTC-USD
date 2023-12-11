const Bitcoin = require("../models/bitcoin");
const { BASE_URL } = require("../utils/constants");

function transform(str) {
  let data = str.split("\n").map((i) => i.split(","));
  let headers = ["date", "price", "amount"];
  let output = data.map((d) => {
    obj = {};
    headers.map((h, i) => (obj[headers[i]] = d[i]));
    let dateTransaction = obj["date"] * 1000;
    obj["date"] = new Date(dateTransaction);
    obj["currency"] = "USD";
    return obj;
  });
  return output;
}

const onePerHour = (arr) => {
  let currentElement = arr[0];
  currentElement.date = new Date(currentElement.date).setMinutes(0, 0, 0);
  let currentDate = currentElement.date;
  let resultArr = [];
  resultArr.push(currentElement);
  resultArr.push.apply(
    resultArr,
    arr
      .map((item) => {
        item.date = new Date(item.date).setMinutes(0, 0, 0);
        return item;
      })
      .filter((item) => {
        if (item.date == currentDate) return false;
        currentDate = item.date;
        return true;
      })
  );
  return resultArr;
};

const requestingThirdPartyData = () => {
  return fetch(BASE_URL)
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      return Promise.reject("Error");
    })
    .then(transform)
    .catch(console.error);
};

const getBitcoinTransactions = (req, res) => {
  const { start, end } = req.body;
  Bitcoin.find({ date: { $gte: start, $lt: end } })
    .then((bitcoinTransactions) => {
      res.status(200).send(bitcoinTransactions);
    })
    .cath(console.error(error));
};

const createBitcoinTransactions = () => {
  requestingThirdPartyData()
    .then(onePerHour)
    .then((arr) => {
      console.log("Запись начата");
      for (let i = 0; i < arr.length; ) {
        let { currency, date, price, amount } = arr[i];
        Bitcoin.create({
          currency,
          date,
          price,
          amount,
        })
          .catch(console.error)
          .finally(i++);
      }
      console.log("Запись завершена");
    });
};

const createBitcoinTransaction = (req, res) => {
  const { currency, date, price, amount } = req;
  Bitcoin.create({
    currency,
    date,
    price,
    amount,
  })
    .then((transaction) => res.status(200).send(transaction))
    .catch(console.error);
};

module.exports = {
  getBitcoinTransactions,
  createBitcoinTransactions,
  createBitcoinTransaction,
};
