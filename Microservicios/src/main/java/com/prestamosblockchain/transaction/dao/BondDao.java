package com.prestamosblockchain.transaction.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.prestamosblockchain.transaction.dto.BondDto;
import com.prestamosblockchain.transaction.dto.ResponseDto;
import com.prestamosblockchain.transaction.dto.TransactionDto;
import com.prestamosblockchain.transaction.rest.RestfulClient;

@Repository
public class BondDao implements IBondDao {
	@Override
	public ResponseDto createBond(BondDto bondDto) {
		RestfulClient<BondDto> restFulClient=new RestfulClient<BondDto>();
		ResponseEntity<ResponseDto> resp=restFulClient.postEntity("bonds",bondDto,ResponseDto.class);
		return resp.getBody();
	}

	@Override
	public BondDto getCreatedBondById(String bondId) {
		RestfulClient<BondDto> restFulClient=new RestfulClient<BondDto>();
		ResponseEntity<BondDto> resp=restFulClient.getEntity("bonds/"+bondId, BondDto.class);
		return resp.getBody();
	}

	@Override
	public List<BondDto> getCreatedBonds(String borrowerId) {
		RestfulClient<BondDto[]> restFulClient=new RestfulClient<BondDto[]>();
		ResponseEntity<BondDto[]> response=restFulClient.getEntity("bonds/available/"+borrowerId, BondDto[].class);
		List<BondDto> resp=new ArrayList<BondDto>(Arrays.asList(response.getBody()));
		return resp;
	}

	@Override
	public ResponseDto borrowBond(BondDto bondDto) {
		RestfulClient<BondDto> restFulClient=new RestfulClient<BondDto>();
		ResponseDto resp=restFulClient.putEntity("bonds/bondId="+bondDto.getId(),bondDto,ResponseDto.class);
		return resp;
	}

	@Override
	public List<BondDto> getBondsByLoanerId(String loanerId) {
		RestfulClient<BondDto[]> restFulClient=new RestfulClient<BondDto[]>();
		ResponseEntity<BondDto[]> response=restFulClient.getEntity("bonds/loaner/"+loanerId, BondDto[].class);
		List<BondDto> resp=new ArrayList<BondDto>(Arrays.asList(response.getBody()));
		return resp;
	}

	@Override
	public List<BondDto> getBondsByborrowerId(String borrowerId) {
		RestfulClient<BondDto[]> restFulClient=new RestfulClient<BondDto[]>();
		ResponseEntity<BondDto[]> response=restFulClient.getEntity("bonds/borrower/"+borrowerId, BondDto[].class);
		List<BondDto> resp=new ArrayList<BondDto>(Arrays.asList(response.getBody()));
		return resp;
	}
}
