package com.prestamosblockchain.transaction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.prestamosblockchain.transaction.dto.BondDto;
import com.prestamosblockchain.transaction.dto.ResponseDto;
import com.prestamosblockchain.transaction.services.IBondService;

@CrossOrigin(origins="*")
@RestController
public class TransactionController implements IBondService {
	@Autowired
	private IBondService bondService;

	/*@Autowired
	private ITransactionService transactionService;*/

	@RequestMapping(method=RequestMethod.POST,path="/bonds")
	@Override
	public ResponseDto createBond(@RequestBody BondDto bondDto) {
		return this.bondService.createBond(bondDto);
	}

	@RequestMapping(method=RequestMethod.GET,path="/bonds/{bondId}")
	@Override
	public BondDto getCreatedBondById(@PathVariable String bondId) {
		return this.bondService.getCreatedBondById(bondId);
	}

	@RequestMapping(method=RequestMethod.GET,path="/bonds/available/{borrowerId:.+}")
	@Override
	public List<BondDto> getCreatedBonds(@PathVariable String borrowerId) {
		return this.bondService.getCreatedBonds(borrowerId);
	}

	@RequestMapping(method=RequestMethod.PUT,path="/bonds")
	@Override
	public ResponseDto borrowBond(@RequestBody BondDto bondDto) {
		return this.bondService.borrowBond(bondDto);
	}

	@RequestMapping(method=RequestMethod.GET,path="/bonds/loaner/{loanerId:.+}")
	@Override
	public List<BondDto> getBondsByLoanerId(@PathVariable String loanerId) {
		return this.bondService.getBondsByLoanerId(loanerId);
	}

	@RequestMapping(method=RequestMethod.GET,path="/bonds/borrower/{borrowerId:.+}")
	@Override
	public List<BondDto> getBondsByborrowerId(@PathVariable String borrowerId) {
		return this.bondService.getBondsByborrowerId(borrowerId);
	}

	/*@RequestMapping(method=RequestMethod.POST,path="/transactions")
	@Override
	public TransactionDto createTransaction(@RequestBody TransactionDto transaction) {
		return this.transactionService.createTransaction(transaction);
	}

	@RequestMapping(method=RequestMethod.GET,path="/transactions/{transactionId}")
	@Override
	public TransactionDto getCreatedTransactionById(@PathVariable int transactionId) {
		return this.transactionService.getCreatedTransactionById(transactionId);
	}

	@RequestMapping(method=RequestMethod.GET,path="/transactions")
	@Override
	public List<TransactionDto> getCreatedTransactions() {
		return this.transactionService.getCreatedTransactions();
	}

	@RequestMapping(method=RequestMethod.GET,path="/transactions/user/{userId}")
	@Override
	public List<TransactionDto> getTransactionByUserId(@PathVariable String userId) {
		return this.transactionService.getTransactionByUserId(userId);
	}*/
}
