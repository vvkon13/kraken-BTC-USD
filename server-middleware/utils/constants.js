const { Joi } = require('celebrate');

const BASE_URL = "http://api.bitcoincharts.com/v1/trades.csv?symbol=krakenUSD";

const BITCOIN_TRANSACTION_VALIDATION_OBJECT = {
  body: Joi.object().keys({
    currency: Joi.string().required().min(1).max(30),
    date: Joi.date().required(),
    price: Joi.number().required(),
    amount: Joi.number().required(),
  }),
};

const DATE_INTERVAL_VALIDATION_OBJECT = {
  body: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().greater(Joi.ref('start')).required(),
  }),
};

module.exports = {
  BITCOIN_TRANSACTION_VALIDATION_OBJECT,
  DATE_INTERVAL_VALIDATION_OBJECT,
  BASE_URL,
}
