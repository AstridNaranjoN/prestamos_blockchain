package com.prestamosblockchain.transaction.dao;

import java.util.List;

import com.prestamosblockchain.transaction.dto.BondDto;
import com.prestamosblockchain.transaction.dto.ResponseDto;

public interface IBondDao {
	public ResponseDto createBond(BondDto bondDto);
	public BondDto getCreatedBondById(String bondId);
	public List<BondDto> getCreatedBonds(String borrowerId);
	public ResponseDto borrowBond(BondDto bondDto);
	public List<BondDto> getBondsByLoanerId(String loanerId);
	public List<BondDto> getBondsByborrowerId(String borrowerId);
}
