package com.prestamosblockchain.transaction.dto;

public class BondDto {
	private String id;
	private String moneyLenderId;
	private String creationDate;
	private String amount;
	private String installments;
	private String interest;
	private String status;
	private String borrowerId;
	private String putDate;
	private String paymentDate;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getMoneyLenderId() {
		return moneyLenderId;
	}
	public void setMoneyLenderId(String moneyLenderId) {
		this.moneyLenderId = moneyLenderId;
	}
	public String getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(String creationDate) {
		this.creationDate = creationDate;
	}
	public String getAmount() {
		return amount;
	}
	public void setAmount(String amount) {
		this.amount = amount;
	}
	public String getInstallments() {
		return installments;
	}
	public void setInstallments(String installments) {
		this.installments = installments;
	}
	public String getInterest() {
		return interest;
	}
	public void setInterest(String interest) {
		this.interest = interest;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getBorrowerId() {
		return borrowerId;
	}
	public void setBorrowerId(String borrowerId) {
		this.borrowerId = borrowerId;
	}
	public String getPutDate() {
		return putDate;
	}
	public void setPutDate(String putDate) {
		this.putDate = putDate;
	}
	public String getPaymentDate() {
		return paymentDate;
	}
	public void setPaymentDate(String paymentDate) {
		this.paymentDate = paymentDate;
	}
}
