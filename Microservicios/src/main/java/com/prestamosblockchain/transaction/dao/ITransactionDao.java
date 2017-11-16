package com.prestamosblockchain.transaction.dao;

import java.util.List;

import com.prestamosblockchain.transaction.dto.TransactionDto;
	public interface ITransactionDao {
	public TransactionDto createTransaction(TransactionDto transactionDto);
	public TransactionDto getCreatedTransactionById(int transactionId);
	public List<TransactionDto> getCreatedTransactions();
	public List<TransactionDto> getTransactionByUserId(String userId);
}
