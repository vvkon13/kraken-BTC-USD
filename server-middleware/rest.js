const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { celebrate } = require("celebrate");
const app = require("express")();

const {
  BITCOIN_TRANSACTION_VALIDATION_OBJECT,
  DATE_INTERVAL_VALIDATION_OBJECT,
} = require("./utils/constants");

const {
  getBitcoinTransactions,
  createBitcoinTransactions,
  createBitcoinTransaction,
} = require("./controllers/bitcoin");

app.use(cors());
app.use(bodyParser.json());
app.get(
  "/",
  celebrate(DATE_INTERVAL_VALIDATION_OBJECT),
  getBitcoinTransactions
);
app.post(
  "/",
  celebrate(BITCOIN_TRANSACTION_VALIDATION_OBJECT),
  createBitcoinTransaction
);

mongoose.connect("mongodb://127.0.0.1:27017/cryptodb");
app.set(setInterval(createBitcoinTransactions, 1000 * 60*60*24));

module.exports = app;
