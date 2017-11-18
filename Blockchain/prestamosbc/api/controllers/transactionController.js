'use strict';


var mongoose = require('mongoose'),
  Transaction = mongoose.model('Transactions');

exports.list_all_transactions = function(req, res) {
  Transaction.find({}, function(err, transaction) {
    if (err)
      res.send(err);
    res.json(transaction);
  });
};




exports.create_a_transaction = function(req, res) {
  var new_transaction = new Transaction(req.body);
  new_transaction.save(function(err, transaction) {
    if (err){
      res.send(err);
    }
    else{
      console.log("transaction.id");
      console.log(transaction._id);
      var nid=transaction._id;
      console.log("nid");
      console.log(nid);
      Transaction.findById(nid, function(err, transaction) {
        if (err){
          res.send(err);
        }
        else{
          transaction.id = nid;
          transaction.save(function(err, transaction) {
            if (err)
              res.send(err);
            res.json(transaction);
          });
        }
      });

    }
  });
};


exports.read_a_transaction = function(req, res) {
  Transaction.findById(req.params.transactionId, function(err, transaction) {
    if (err)
      res.send(err);
    res.json(transaction);
  });
};


exports.update_a_transaction = function(req, res) {
  Transaction.findOneAndUpdate({_id: req.params.transactionId}, req.body, {new: true}, function(err, transaction) {
    if (err)
      res.send(err);
    res.json(transaction);
  });
};


exports.delete_a_transaction = function(req, res) {


  Transaction.remove({
    _id: req.params.transactionId
  }, function(err, transaction) {
    if (err)
      res.send(err);
    res.json({ message: 'Transaction successfully deleted' });
  });
};