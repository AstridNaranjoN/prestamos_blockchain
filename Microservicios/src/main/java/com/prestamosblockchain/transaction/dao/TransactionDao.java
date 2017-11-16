package com.prestamosblockchain.transaction.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.prestamosblockchain.transaction.dto.TransactionDto;
import com.prestamosblockchain.transaction.rest.RestfulClient;

@Repository
public class TransactionDao implements ITransactionDao{
	@Override
	public TransactionDto createTransaction(TransactionDto transactionDto) {
		RestfulClient<TransactionDto> restFulClient=new RestfulClient<TransactionDto>();
		ResponseEntity<TransactionDto> response=restFulClient.postEntity("transactions",transactionDto,TransactionDto.class);
		return response.getBody();
	}

	@Override
	public TransactionDto getCreatedTransactionById(int transactionId) {
		RestfulClient<TransactionDto> restFulClient=new RestfulClient<TransactionDto>();
		ResponseEntity<TransactionDto> response=restFulClient.getEntity("transactions/"+transactionId, TransactionDto.class);
		return response.getBody();
	}

	@Override
	public List<TransactionDto> getCreatedTransactions() {
		RestfulClient<TransactionDto[]> restFulClient=new RestfulClient<TransactionDto[]>();
		ResponseEntity<TransactionDto[]> response=restFulClient.getEntity("transactions", TransactionDto[].class);
		List<TransactionDto> list=new ArrayList<TransactionDto>(Arrays.asList(response.getBody()));
		return list;
	}

	@Override
	public List<TransactionDto> getTransactionByUserId(String userId) {
		// TODO Auto-generated method stub
		return null;
	}
}
