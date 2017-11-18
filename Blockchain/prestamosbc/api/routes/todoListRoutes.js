'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/todoListController');
  var bond = require('../controllers/bondController');
  var transaction = require('../controllers/transactionController');

  // todoList Routes
  app.route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);


  app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);




  // bond Routes
  app.route('/bonds')
    .get(bond.list_all_bonds)
    .post(bond.create_a_bond);


  app.route('/bonds/:bondId')
    .get(bond.read_a_bond)
    .put(bond.update_a_bond)
    .delete(bond.delete_a_bond);

  app.route('/bonds/loaner/:loanerId')
    .get(bond.list_all_bonds_by_owner)

  app.route('/bonds/borrower/:borrowerId')
    .get(bond.list_all_bonds_by_borrower)
  
  app.route('/bonds/available/:borrowerId')
    .get(bond.list_all_bonds_available)




  // transaction Routes
  app.route('/transactions')
    .get(transaction.list_all_transactions)
    .post(transaction.create_a_transaction);


  app.route('/transactions/:transactionId')
    .get(transaction.read_a_transaction)
    .put(transaction.update_a_transaction)
    .delete(transaction.delete_a_transaction);

  app.route('/transactions/user/:userId')
    .get(transaction.list_all_transactions)
};