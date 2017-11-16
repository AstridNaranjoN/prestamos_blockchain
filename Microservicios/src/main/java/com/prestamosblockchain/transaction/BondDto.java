package com.prestamosblockchain.transaction;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.prestamosblockchain.transaction.dto.BondsStatus;

/**
 * Clase que representa al información almacenada en los bonos.
 * 
 * @author JM
 *
 */
@Entity
public class BondDto {
	/**
	 * Identificador del bono creado.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	/**
	 * Prestatario
	 */
	private String moneyLenderId;
	/**
	 * Prestamista
	 */
	private String borrowerId;
	/**
	 * Monto del bono.
	 */
	private BigDecimal amount;
	/**
	 * Cuotas
	 */
	private int installments;
	/**
	 * Fecha de creación
	 */
	private Date creationDate;
	/**
	 * Estado del bono
	 */
	private BondsStatus status;

	/**
	 * Retorna le Id dle bono
	 * 
	 * @return
	 */
	public Integer getId() {
		return id;
	}

	/**
	 * Asigna el ID del bono
	 * 
	 * @param id
	 */
	public void setId(Integer id) {
		this.id = id;
	}

	/**
	 * Retorna prestatario
	 * 
	 * @return
	 */
	public String getMoneyLenderId() {
		return moneyLenderId;
	}

	/**
	 * Asigna el prestatario
	 * 
	 * @param moneyLenderId
	 */
	public void setMoneyLenderId(String moneyLenderId) {
		this.moneyLenderId = moneyLenderId;
	}

	/**
	 * Retorna el prestamista
	 * 
	 * @return
	 */
	public String getBorrowerId() {
		return borrowerId;
	}

	/**
	 * Asigna el prestamista
	 * 
	 * @param borrowerId
	 */
	public void setBorrowerId(String borrowerId) {
		this.borrowerId = borrowerId;
	}

	/**
	 * Retorna el monto del bono
	 * 
	 * @return
	 */
	public BigDecimal getAmount() {
		return amount;
	}

	/**
	 * Asigna el monto del bono
	 * 
	 * @param amount
	 */
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	/**
	 * Retorna el número de cuotas
	 * 
	 * @return
	 */
	public int getInstallments() {
		return installments;
	}

	/**
	 * Asigan el número de cuotas
	 * 
	 * @param installments
	 */
	public void setInstallments(int installments) {
		this.installments = installments;
	}

	/**
	 * Retorna la fecha de creación
	 * 
	 * @return
	 */
	public Date getCreationDate() {
		return creationDate;
	}

	/**
	 * Asigna la fecha de creación
	 * 
	 * @param creationDate
	 */
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	/**
	 * Retorna el estado del bono
	 * 
	 * @return
	 */
	public BondsStatus getStatus() {
		return status;
	}

	/**
	 * Asigna el estado del bono.
	 * 
	 * @param status
	 */
	public void setStatus(BondsStatus status) {
		this.status = status;
	}

}
