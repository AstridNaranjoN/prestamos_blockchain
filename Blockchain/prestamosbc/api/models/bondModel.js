'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BondSchema = new Schema({
  id: {
    type: String
  },
  moneyLenderId: {
    type: String,
    default: 'yo@gmail.com'
  },
  creationDate: {
    type: String,
    default: '1000000'
  },
  amount: {
    type: String,
    default: '1000000'
  },
  installments: {
    type: String,
    default: '1'
  },
  interest: {
    type: String,
    default: '10'
  },
  borrowerId: {
    type: String,
    default: ''
  },
  putDate: {
    type: String,
    default: ''
  },
  paymentDate: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'CREATED'
  }
});

module.exports = mongoose.model('Bonds', BondSchema);