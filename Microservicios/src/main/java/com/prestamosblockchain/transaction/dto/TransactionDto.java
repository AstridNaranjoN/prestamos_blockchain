package com.prestamosblockchain.transaction.dto;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class TransactionDto {
	private int id;
	private int bondId;
	private String userId;
	private BigDecimal amount;
	private TransactionTypes type;
	@JsonIgnore
	private String hash;
	private int previusTransactionId;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getBondId() {
		return bondId;
	}

	public void setBondId(int bondId) {
		this.bondId = bondId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public TransactionTypes getType() {
		return type;
	}

	public void setType(TransactionTypes type) {
		this.type = type;
	}

	public String getHash() {
		return hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public int getPreviusTransactionId() {
		return previusTransactionId;
	}

	public void setPreviusTransactionId(int previusTransactionId) {
		this.previusTransactionId = previusTransactionId;
	}
}
