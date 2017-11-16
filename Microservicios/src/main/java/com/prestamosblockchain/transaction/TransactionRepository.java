package com.prestamosblockchain.transaction;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface TransactionRepository extends CrudRepository<TransactionDto, Integer> {
	public List<TransactionDto> findById(int id);

	public List<TransactionDto> findByUserId(String userId);

	public List<TransactionDto> findAll();

	public TransactionDto save(TransactionDto transactionDto);
}
