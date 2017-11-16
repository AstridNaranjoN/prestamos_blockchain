/**
 *
 */
package com.prestamosblockchain.transaction.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prestamosblockchain.transaction.dao.IBondDao;
import com.prestamosblockchain.transaction.dto.BondDto;
import com.prestamosblockchain.transaction.dto.ResponseDto;

@Service
public class BondService implements IBondService {
	@Autowired
	private IBondDao bondDao;

	@Override
	public ResponseDto createBond(BondDto bondDto) {
		return this.bondDao.createBond(bondDto);
	}

	@Override
	public BondDto getCreatedBondById(String bondId) {
		return this.bondDao.getCreatedBondById(bondId);
	}

	@Override
	public List<BondDto> getCreatedBonds(String borrowerId) {
		return this.bondDao.getCreatedBonds(borrowerId);
	}

	@Override
	public ResponseDto borrowBond(BondDto bondDto) {
		return this.bondDao.borrowBond(bondDto);
	}

	@Override
	public List<BondDto> getBondsByLoanerId(String loanerId) {
		return this.bondDao.getBondsByLoanerId(loanerId);
	}

	@Override
	public List<BondDto> getBondsByborrowerId(String borrowerId) {
		return this.bondDao.getBondsByborrowerId(borrowerId);
	}
}
