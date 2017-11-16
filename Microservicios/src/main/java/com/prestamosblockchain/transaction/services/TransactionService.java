package com.prestamosblockchain.transaction.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.prestamosblockchain.transaction.dao.ITransactionDao;
import com.prestamosblockchain.transaction.dto.TransactionDto;

@Service
public class TransactionService implements ITransactionService {
	@Autowired
	private ITransactionDao transactionDao;

	@Override
	public TransactionDto createTransaction(TransactionDto transactionDto) {
		return this.transactionDao.createTransaction(transactionDto);
	}

	@Override
	public TransactionDto getCreatedTransactionById(int id) {
		return this.transactionDao.getCreatedTransactionById(id);
	}

	@Override
	public List<TransactionDto> getCreatedTransactions() {
		return this.transactionDao.getCreatedTransactions();
	}

	@Override
	public List<TransactionDto> getTransactionByUserId(String userId) {
		return null;
	}

}
