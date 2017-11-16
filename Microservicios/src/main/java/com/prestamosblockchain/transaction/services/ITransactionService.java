package com.prestamosblockchain.transaction.services;

import java.util.List;

import com.prestamosblockchain.transaction.dto.TransactionDto;

public interface ITransactionService {
	public TransactionDto createTransaction(TransactionDto transactionDto);
	public TransactionDto getCreatedTransactionById(int transactionId);
	public List<TransactionDto> getCreatedTransactions();
	public List<TransactionDto> getTransactionByUserId(String userId);
}
