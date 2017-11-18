'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TransactionSchema = new Schema({
  id: {
    type: String
  },
  bondId: {
    type: String
  },
  userId: {
    type: String
  },
  amount: {
    type: String
  },
  type: {
    type: String
  },
  previusTransactionId: {
    type: String
  },
  operationDate: {
    type: Date,
    default: Date.now
  } 
});

module.exports = mongoose.model('Transactions', TransactionSchema);