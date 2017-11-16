package com.prestamosblockchain.transaction;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface BondsRepository extends CrudRepository<BondDto,Integer>{
	public List<BondDto> findById(int id);

	public List<BondDto> findByMoneyLenderId(String moneyLenderId);

	public List<BondDto> findByBorrowerId(String borrowerId);

	public List<BondDto> findAll();

	public BondDto save(BondDto bondDto);
}
