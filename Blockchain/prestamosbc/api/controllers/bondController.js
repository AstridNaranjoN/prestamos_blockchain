'use strict';


var mongoose = require('mongoose'), 
Bond = mongoose.model('Bonds');

var hfc = require('fabric-client');
var path = require('path');
var util = require('util');



  exports.create_a_bond = function(req, res) {
    /*var new_bond = new Bond(req.body);
    new_bond.save(function(err, bond) {
      if (err){
        res.send(err);
      }
      else{
        console.log("bond.id");
        console.log(bond._id);
        var nid=bond._id;
        console.log("nid");
        console.log(nid);
        Bond.findById(nid, function(err, bond) {
          if (err){
            res.send(err);
          }
          else{
            bond.id = nid;
            bond.save(function(err, bond) {
              if (err)
                res.send(err);
              res.json(bond);
            });
          }
        });
  
      }
    });*/

    var bond = new Bond(req.body);
    console.log("bond.moneyLenderId: ", bond.moneyLenderId);
    
    var options = {
      wallet_path: path.join(__dirname, './creds'),
      user_id: 'PeerAdmin',
      channel_id: 'mychannel',
      chaincode_id: 'fabcar',
      peer_url: 'grpc://localhost:7051',
      event_url: 'grpc://localhost:7053',
      orderer_url: 'grpc://localhost:7050'
    };
  
    var channel = {};
    var client = null;
    var targets = [];
    var tx_id = null;
    Promise.resolve().then(() => {
        console.log("Create a client and set the wallet location");
        client = new hfc();
        return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
    }).then((wallet) => {
        console.log("Set wallet path, and associate user ", options.user_id, " with application");
        client.setStateStore(wallet);
        return client.getUserContext(options.user_id, true);
    }).then((user) => {
        console.log("Check user is enrolled, and set a query URL in the network");
        if (user === undefined || user.isEnrolled() === false) {
            console.error("User not defined, or not enrolled - error");
        }
        channel = client.newChannel(options.channel_id);
        var peerObj = client.newPeer(options.peer_url);
        channel.addPeer(peerObj);
        channel.addOrderer(client.newOrderer(options.orderer_url));
        targets.push(peerObj);
        return;
    }).then(() => {
        tx_id = client.newTransactionID();
        console.log("Assigning transaction_id: ", tx_id._transaction_id);

        bond.id=tx_id._transaction_id;
        console.log("bond.id: ", bond.id);
        console.log("bond.moneyLenderId: ", bond.moneyLenderId);
        console.log("bond.creationDate: ", bond.creationDate);
        console.log("bond.amount: ", bond.amount);
        console.log("bond.installments: ", bond.installments);
        console.log("bond.interest: ", bond.interest);
        var request = {
            targets: targets,
            chaincodeId: options.chaincode_id,
            fcn: 'createCar',
            args: [bond.id, bond.moneyLenderId, bond.creationDate, bond.amount, bond.installments, bond.interest],
            chainId: options.channel_id,
            txId: tx_id
        };
        return channel.sendTransactionProposal(request);
    }).then((results) => {
        var proposalResponses = results[0];
        var proposal = results[1];
        var header = results[2];
        let isProposalGood = false;
        if (proposalResponses && proposalResponses[0].response &&
            proposalResponses[0].response.status === 200) {
            isProposalGood = true;
            console.log('transaction proposal was good');
        } else {
            console.error('transaction proposal was bad');
        }
        if (isProposalGood) {
            console.log(util.format(
                'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                proposalResponses[0].response.status, proposalResponses[0].response.message,
                proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
            var request = {
                proposalResponses: proposalResponses,
                proposal: proposal,
                header: header
            };
            // set the transaction listener and set a timeout of 30sec
            // if the transaction did not get committed within the timeout period,
            // fail the test
            var transactionID = tx_id.getTransactionID();
            var eventPromises = [];
            let eh = client.newEventHub();
            eh.setPeerAddr(options.event_url);
            eh.connect();
  
            let txPromise = new Promise((resolve, reject) => {
                let handle = setTimeout(() => {
                    eh.disconnect();
                    reject();
                }, 30000);
  
                eh.registerTxEvent(transactionID, (tx, code) => {
                    clearTimeout(handle);
                    eh.unregisterTxEvent(transactionID);
                    eh.disconnect();
  
                    if (code !== 'VALID') {
                        console.error(
                            'The transaction was invalid, code = ' + code);
                        reject();
                    } else {
                        console.log(
                            'The transaction has been committed on peer ' +
                            eh._ep._endpoint.addr);
                        resolve();
                    }
                });
            });
            eventPromises.push(txPromise);
            var sendPromise = channel.sendTransaction(request);
            return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                console.log(' event promise all complete and testing complete');
                return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
            }).catch((err) => {
                console.error(
                    'Failed to send transaction and get notifications within the timeout period.'
                );
                return 'Failed to send transaction and get notifications within the timeout period.';
            });
        } else {
            console.error(
                'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
            );
            return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
        }
    }, (err) => {
        console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
            err);
        return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
            err;
    }).then((response) => {
        if (response.status === 'SUCCESS') {
            console.log('Successfully sent transaction to the orderer.');
            console.log('Id: ',bond.id); 
            return tx_id.getTransactionID();
        } else {
            console.error('Failed to order the transaction. Error code: ' + response.status);
            return 'Failed to order the transaction. Error code: ' + response.status;
        }
    }, (err) => {
        console.error('Failed to send transaction due to error: ' + err.stack ? err
            .stack : err);
        return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
            err;
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ respuesta: 1 }));
    
  };



  exports.update_a_bond = function(req, res) {
    /*Bond.findOneAndUpdate({_id: req.params.bondId}, req.body, {new: true}, function(err, bond) {
      if (err)
        res.send(err);
      res.json(bond);
    });*/

  var bond = new Bond(req.body);
  //bond.id=req.params.bondId;

  var options = {
      wallet_path: path.join(__dirname, './creds'),
      user_id: 'PeerAdmin',
      channel_id: 'mychannel',
      chaincode_id: 'fabcar',
      peer_url: 'grpc://localhost:7051',
      event_url: 'grpc://localhost:7053',
      orderer_url: 'grpc://localhost:7050'
  };
  
  var channel = {};
  var client = null;
  var targets = [];
  var tx_id = null;
  Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
  }).then((wallet) => {
      console.log("Set wallet path, and associate user ", options.user_id, " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
  }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
          console.error("User not defined, or not enrolled - error");
      }
      channel = client.newChannel(options.channel_id);
      var peerObj = client.newPeer(options.peer_url);
      channel.addPeer(peerObj);
      channel.addOrderer(client.newOrderer(options.orderer_url));
      targets.push(peerObj);
      return;
  }).then(() => {
      tx_id = client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);
      // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
      // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
      // send proposal to endorser

      console.log("bond.id: ", bond.id);
      console.log("bond.borrowerId: ", bond.borrowerId);
      console.log("bond.putDate: ", bond.putDate);
      console.log("bond.status: ", bond.status);
 
      if(bond.status=='PUT'){
        var request = {
          targets: targets,
          chaincodeId: options.chaincode_id,
          fcn: 'adquireBond',
          args: [bond.id, bond.borrowerId, bond.putDate, bond.status],
          chainId: options.channel_id,
          txId: tx_id
        };
        return channel.sendTransactionProposal(request);
      }
      else{
        var request = {
          targets: targets,
          chaincodeId: options.chaincode_id,
          fcn: 'payBond',
          args: [bond.id, bond.paymentDate, bond.status],
          chainId: options.channel_id,
          txId: tx_id
        };
        return channel.sendTransactionProposal(request);
      }
  }).then((results) => {
      var proposalResponses = results[0];
      var proposal = results[1];
      var header = results[2];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response &&
          proposalResponses[0].response.status === 200) {
          isProposalGood = true;
          console.log('transaction proposal was good');
      } else {
          console.error('transaction proposal was bad');
      }
      if (isProposalGood) {
          console.log(util.format(
              'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
              proposalResponses[0].response.status, proposalResponses[0].response.message,
              proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
          var request = {
              proposalResponses: proposalResponses,
              proposal: proposal,
              header: header
          };
          // set the transaction listener and set a timeout of 30sec
          // if the transaction did not get committed within the timeout period,
          // fail the test
          var transactionID = tx_id.getTransactionID();
          var eventPromises = [];
          let eh = client.newEventHub();
          eh.setPeerAddr(options.event_url);
          eh.connect();
  
          let txPromise = new Promise((resolve, reject) => {
              let handle = setTimeout(() => {
                  eh.disconnect();
                  reject();
              }, 30000);
  
              eh.registerTxEvent(transactionID, (tx, code) => {
                  clearTimeout(handle);
                  eh.unregisterTxEvent(transactionID);
                  eh.disconnect();
  
                  if (code !== 'VALID') {
                      console.error(
                          'The transaction was invalid, code = ' + code);
                      reject();
                  } else {
                      console.log(
                          'The transaction has been committed on peer ' +
                          eh._ep._endpoint.addr);
                      resolve();
                  }
              });
          });
          eventPromises.push(txPromise);
          var sendPromise = channel.sendTransaction(request);
          return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
              console.log(' event promise all complete and testing complete');
              return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
          }).catch((err) => {
              console.error(
                  'Failed to send transaction and get notifications within the timeout period.'
              );
              return 'Failed to send transaction and get notifications within the timeout period.';
          });
      } else {
          console.error(
              'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
          );
          return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
      }
  }, (err) => {
      console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
          err);
      return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
          err;
  }).then((response) => {
      if (response.status === 'SUCCESS') {
          console.log('Successfully sent transaction to the orderer.');
          return tx_id.getTransactionID();
      } else {
          console.error('Failed to order the transaction. Error code: ' + response.status);
          return 'Failed to order the transaction. Error code: ' + response.status;
      }
  }, (err) => {
      console.error('Failed to send transaction due to error: ' + err.stack ? err
          .stack : err);
      return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
          err;
  });
  
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ respuesta: 1 }));

};

exports.list_all_bonds = function(req, res) {
  /*Bond.find({}, function(err, bond) {
    if (err)
      res.send(err);
    res.json(bond);
  });*/
  //res.json({ message: 'Bond successfully deleted' });
  //echo 'Bond successfully deleted';
  //res.write('Hello World!'); //write a response to the client
  //res.end(); //end the response

  
  
  var options = {
    wallet_path: path.join(__dirname, './creds'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'fabcar',
    network_url: 'grpc://localhost:7051',
  };

  var channel = {};
  var client = null;

  Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
  }).then((wallet) => {
      console.log("Set wallet path, and associate user ", options.user_id, " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
  }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
          console.error("User not defined, or not enrolled - error");
      }
      channel = client.newChannel(options.channel_id);
      channel.addPeer(client.newPeer(options.network_url));
      return;
  }).then(() => {
      console.log("Make query");
      var transaction_id = client.newTransactionID();
      console.log("Assigning transaction_id: ", transaction_id._transaction_id);

      // queryCar - requires 1 argument, ex: args: ['CAR4'],
      // queryAllCars - requires no arguments , ex: args: [''],
      const request = {
          chaincodeId: options.chaincode_id,
          txId: transaction_id,
          fcn: 'queryAvailableBonds',
          args: ['prestamista@gmail.com']
      };
      return channel.queryByChaincode(request);
  }).then((query_responses) => {
      console.log("returned from query");
      if (!query_responses.length) {
          console.log("No payloads were returned from query");
      } else {
          console.log("Query result count = ", query_responses.length)
      }
      if (query_responses[0] instanceof Error) {
          console.error("error from query = ", query_responses[0]);
      }
      console.log("Response is ", query_responses[0].toString());
      //res.write(query_responses[0].toString());
      //res.end();

      res.setHeader('Content-Type', 'application/json');
      res.send(query_responses[0].toString());
  }).catch((err) => {
      console.error("Caught Error", err);
  });


};

exports.list_all_bonds_by_owner = function(req, res) {
  /*Bond.find({}, function(err, bond) {
    if (err)
      res.send(err);
    res.json(bond);
  });*/
  //res.json({ message: 'Bond successfully deleted' });
  //echo 'Bond successfully deleted';
  //res.write('Hello World!'); //write a response to the client
  //res.end(); //end the response

  var loaner=req.params.loanerId;
  
  var options = {
    wallet_path: path.join(__dirname, './creds'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'fabcar',
    network_url: 'grpc://localhost:7051',
  };

  var channel = {};
  var client = null;

  Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
  }).then((wallet) => {
      console.log("Set wallet path, and associate user ", options.user_id, " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
  }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
          console.error("User not defined, or not enrolled - error");
      }
      channel = client.newChannel(options.channel_id);
      channel.addPeer(client.newPeer(options.network_url));
      return;
  }).then(() => {
      console.log("Make query");
      var transaction_id = client.newTransactionID();
      console.log("loaner: ", loaner);

      // queryCar - requires 1 argument, ex: args: ['CAR4'],
      // queryAllCars - requires no arguments , ex: args: [''],
      const request = {
          chaincodeId: options.chaincode_id,
          txId: transaction_id,
          fcn: 'queryBondsByOwner',
          args: [loaner]
      };
      return channel.queryByChaincode(request);
  }).then((query_responses) => {
      console.log("returned from query");
      if (!query_responses.length) {
          console.log("No payloads were returned from query");
      } else {
          console.log("Query result count = ", query_responses.length)
      }
      if (query_responses[0] instanceof Error) {
          console.error("error from query = ", query_responses[0]);
      }
      console.log("Response is ", query_responses[0].toString());
      //res.write(query_responses[0].toString());
      //res.end();

      res.setHeader('Content-Type', 'application/json');
      res.send(query_responses[0].toString());
  }).catch((err) => {
      console.error("Caught Error", err);
  });


};

exports.list_all_bonds_by_borrower = function(req, res) {
  /*Bond.find({}, function(err, bond) {
    if (err)
      res.send(err);
    res.json(bond);
  });*/
  //res.json({ message: 'Bond successfully deleted' });
  //echo 'Bond successfully deleted';
  //res.write('Hello World!'); //write a response to the client
  //res.end(); //end the response

  var borrower=req.params.borrowerId;
  
  var options = {
    wallet_path: path.join(__dirname, './creds'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'fabcar',
    network_url: 'grpc://localhost:7051',
  };

  var channel = {};
  var client = null;

  Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
  }).then((wallet) => {
      console.log("Set wallet path, and associate user ", options.user_id, " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
  }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
          console.error("User not defined, or not enrolled - error");
      }
      channel = client.newChannel(options.channel_id);
      channel.addPeer(client.newPeer(options.network_url));
      return;
  }).then(() => {
      console.log("Make query");
      var transaction_id = client.newTransactionID();
      console.log("borrower: ", borrower);

      // queryCar - requires 1 argument, ex: args: ['CAR4'],
      // queryAllCars - requires no arguments , ex: args: [''],
      const request = {
          chaincodeId: options.chaincode_id,
          txId: transaction_id,
          fcn: 'queryAdquiredBonds',
          args: [borrower]
      };
      return channel.queryByChaincode(request);
  }).then((query_responses) => {
      console.log("returned from query");
      if (!query_responses.length) {
          console.log("No payloads were returned from query");
      } else {
          console.log("Query result count = ", query_responses.length)
      }
      if (query_responses[0] instanceof Error) {
          console.error("error from query = ", query_responses[0]);
      }
      console.log("Response is ", query_responses[0].toString());
      //res.write(query_responses[0].toString());
        //res.end();

        res.setHeader('Content-Type', 'application/json');
        res.send(query_responses[0].toString());
  }).catch((err) => {
      console.error("Caught Error", err);
  });


};

exports.list_all_bonds_available = function(req, res) {
  /*Bond.find({}, function(err, bond) {
    if (err)
      res.send(err);
    res.json(bond);
  });*/
  //res.json({ message: 'Bond successfully deleted' });
  //echo 'Bond successfully deleted';
  //res.write('Hello World!'); //write a response to the client
  //res.end(); //end the response

  var borrower=req.params.borrowerId;
  
  var options = {
    wallet_path: path.join(__dirname, './creds'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'fabcar',
    network_url: 'grpc://localhost:7051',
  };

  var channel = {};
  var client = null;

  Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
  }).then((wallet) => {
      console.log("Set wallet path, and associate user ", options.user_id, " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
  }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
          console.error("User not defined, or not enrolled - error");
      }
      channel = client.newChannel(options.channel_id);
      channel.addPeer(client.newPeer(options.network_url));
      return;
  }).then(() => {
      console.log("Make query");
      var transaction_id = client.newTransactionID();
      console.log("borrower: ", borrower);

      // queryCar - requires 1 argument, ex: args: ['CAR4'],
      // queryAllCars - requires no arguments , ex: args: [''],
      const request = {
          chaincodeId: options.chaincode_id,
          txId: transaction_id,
          fcn: 'queryAvailableBonds',
          args: [borrower]
      };
      return channel.queryByChaincode(request);
  }).then((query_responses) => {
      console.log("returned from query");
      if (!query_responses.length) {
          console.log("No payloads were returned from query");
      } else {
          console.log("Query result count = ", query_responses.length)
      }
      if (query_responses[0] instanceof Error) {
          console.error("error from query = ", query_responses[0]);
      }
      console.log("Response is ", query_responses[0].toString());
      //res.write(query_responses[0].toString());
    //res.end();

    res.setHeader('Content-Type', 'application/json');
    res.send(query_responses[0].toString());
  }).catch((err) => {
      console.error("Caught Error", err);
  });


};



exports.read_a_bond = function(req, res) {
  /*Bond.findById(req.params.bondId, function(err, bond) {
    if (err)
      res.send(err);
    res.json(bond);
  });*/

  var bid=req.params.bondId;

  var options = {
    wallet_path: path.join(__dirname, './creds'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'fabcar',
    network_url: 'grpc://localhost:7051',
};

var channel = {};
var client = null;

Promise.resolve().then(() => {
    console.log("Create a client and set the wallet location");
    client = new hfc();
    return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
}).then((wallet) => {
    console.log("Set wallet path, and associate user ", options.user_id, " with application");
    client.setStateStore(wallet);
    return client.getUserContext(options.user_id, true);
}).then((user) => {
    console.log("Check user is enrolled, and set a query URL in the network");
    if (user === undefined || user.isEnrolled() === false) {
        console.error("User not defined, or not enrolled - error");
    }
    channel = client.newChannel(options.channel_id);
    channel.addPeer(client.newPeer(options.network_url));
    return;
}).then(() => {
    console.log("Make query");
    var transaction_id = client.newTransactionID();
    console.log("Assigning transaction_id: ", transaction_id._transaction_id);

    // queryCar - requires 1 argument, ex: args: ['CAR4'],
    // queryAllCars - requires no arguments , ex: args: [''],
    const request = {
        chaincodeId: options.chaincode_id,
        txId: transaction_id,
        fcn: 'queryCar',
        args: [bid]
    };
    return channel.queryByChaincode(request);
}).then((query_responses) => {
    console.log("returned from query");
    if (!query_responses.length) {
        console.log("No payloads were returned from query");
    } else {
        console.log("Query result count = ", query_responses.length)
    }
    if (query_responses[0] instanceof Error) {
        console.error("error from query = ", query_responses[0]);
    }
    console.log("Response is ", query_responses[0].toString());
    //res.write(query_responses[0].toString());
    //res.end();

    res.setHeader('Content-Type', 'application/json');
    res.send(query_responses[0].toString());
}).catch((err) => {
    console.error("Caught Error", err);
});

};


exports.delete_a_bond = function(req, res) {


  Bond.remove({
    _id: req.params.bondId
  }, function(err, bond) {
    if (err)
      res.send(err);
    res.json({ message: 'Bond successfully deleted' });
  });
};