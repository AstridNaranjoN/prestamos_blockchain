/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	//"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
type Car struct {
	Id	string `json:"id"`
	MoneyLenderId   string `json:"moneyLenderId"`
	CreationDate   string `json:"creationDate"`
	Amount string `json:"amount"`
	Installments  string `json:"installments"`
	Interest  string `json:"interest"`
	Status  string `json:"status"`
	BorrowerId   string `json:"borrowerId"`
	PutDate   string `json:"putDate"`
	PaymentDate   string `json:"paymentDate"`
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryCar" {
		return s.queryCar(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createCar" {
		return s.createCar(APIstub, args)
	} else if function == "queryAllCars" {
		return s.queryAllCars(APIstub)
	} else if function == "changeCarOwner" {
		return s.changeCarOwner(APIstub, args)
	} else if function == "queryAllBonds" {
		return s.queryAllBonds(APIstub)
	}  else if function == "adquireBond" { //find marbles for owner X using rich query
		return s.adquireBond(APIstub, args)
	}else if function == "payBond" { //find marbles for owner X using rich query
		return s.payBond(APIstub, args)
	}else if function == "queryAvailableBonds" { //find marbles for owner X using rich query
		return s.queryAvailableBonds(APIstub, args)
	}else if function == "queryBondsByOwner" { //find marbles for owner X using rich query
		return s.queryBondsByOwner(APIstub, args)
	}else if function == "queryAdquiredBonds" { //find marbles for owner X using rich query
		return s.queryAdquiredBonds(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(carAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	cars := []Car{
		Car{Id: "1",MoneyLenderId: "prestamista@gmail.com", CreationDate: "11111", Amount: "1000000", Installments: "1", Interest: "10", Status: "CREATED"},
		Car{Id: "2",MoneyLenderId: "prestamista@gmail.com", CreationDate: "22222", Amount: "1000000", Installments: "1", Interest: "10", Status: "CREATED"},
	}

	i := 0
	for i < len(cars) {
		fmt.Println("i is ", i)
		carAsBytes, _ := json.Marshal(cars[i])
		APIstub.PutState("CAR"+strconv.Itoa(i), carAsBytes)
		fmt.Println("Added", cars[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}
	
	//nano:=time.Now().UnixNano()
	//uid := fmt.Sprint(nano)

	uid := args[0]

	var car = Car{Id: uid, MoneyLenderId: args[1], CreationDate: args[2], Amount: args[3], Installments: args[4], Interest: args[5], Status: "CREATED"}

	carAsBytes, _ := json.Marshal(car)
	APIstub.PutState(uid, carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) adquireBond(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	car.BorrowerId = args[1]
	car.PutDate = args[2]
	car.Status = args[3]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) payBond(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	car.PaymentDate = args[1]
	car.Status = args[2]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryAvailableBonds(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	owner := args[0]
	//queryString := fmt.Sprintf("{\"selector\":{\"status\":\"CREATED\",\"moneyLenderid\":\"%s\"}}", owner)
	//queryString := fmt.Sprintf("{\"selector\":{\"status\":\"CREATED\"}}")
	//queryString := fmt.Sprintf("{\"selector\":{\"status\":\"CREATED\",\"moneyLenderid\":{\"$ne\":\"%s\"}}}", owner)
	//queryString := fmt.Sprintf("{\"selector\":{\"status\":\"CREATED\", \"moneyLenderId\":{\"$ne\":\"%s\"}, \"creationDate\":{\"$ne\":\"asdf\"}}, \"sort\": [{\"creationDate\": \"asc\"}]}", owner)
	queryString := fmt.Sprintf("{\"selector\":{\"status\":\"CREATED\", \"moneyLenderId\":{\"$ne\":\"%s\"}}}", owner)

	

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func (s *SmartContract) queryBondsByOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	    if len(args) < 1 {
			return shim.Error("Incorrect number of arguments. Expecting 1")
		}
		owner := args[0]
		//queryString := fmt.Sprintf("{\"selector\":{\"moneyLenderId\":\"%s\", \"creationDate\":{\"$ne\":\"asdf\"}}, \"sort\": [{\"creationDate\": \"asc\"}]}", owner)
		queryString := fmt.Sprintf("{\"selector\":{\"moneyLenderId\":\"%s\"}}", owner)
		queryResults, err := getQueryResultForQueryString(APIstub, queryString)
		if err != nil {
			return shim.Error(err.Error())
		}
		return shim.Success(queryResults)
}

func (s *SmartContract) queryAdquiredBonds(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	    if len(args) < 1 {
			return shim.Error("Incorrect number of arguments. Expecting 1")
		}
		owner := args[0]
		//queryString := fmt.Sprintf("{\"selector\":{\"borrowerId\":\"%s\", \"putDate\":{\"$ne\":\"asdf\"}}, \"sort\": [{\"putDate\": \"asc\"}]}", owner)
		queryString := fmt.Sprintf("{\"selector\":{\"borrowerId\":\"%s\"}}", owner)
		queryResults, err := getQueryResultForQueryString(APIstub, queryString)
		if err != nil {
			return shim.Error(err.Error())
		}
		return shim.Success(queryResults)
}





func (s *SmartContract) changeCarOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	car.BorrowerId = args[1]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryAllCars(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "CAR0"
	endKey := "CAR999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllCars:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) queryAllBonds(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "CAR0"
	endKey := "CAR999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString(string(queryResponse.Value))
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllCars:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func getQueryResultForQueryString(APIstub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := APIstub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		/*buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")*/


		buffer.WriteString(string(queryResponse.Value))
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
