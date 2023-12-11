const mongoose = require("mongoose");

const bitcoinSchema = new mongoose.Schema({
  currency: {
    type: String,
    minLength: 1,
    maxLength: 30,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Bitcoin = mongoose.model("bitcoin", bitcoinSchema);

module.exports = Bitcoin;
