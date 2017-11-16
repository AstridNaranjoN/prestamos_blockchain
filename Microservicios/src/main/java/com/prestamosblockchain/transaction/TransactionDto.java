package com.prestamosblockchain.transaction;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.prestamosblockchain.transaction.dto.TransactionTypes;

/**
 * Representa la información de una transacción
 * 
 * @author JM
 *
 */
@Entity
public class TransactionDto {

	/**
	 * Identificador de la transacción.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	/**
	 * Identifiación del bono objeto de la transacción.
	 */
	private int bondId;
	/**
	 * Usuario que realiza la transacción.
	 */
	private String userId;
	/**
	 * Monto de la transacción
	 */
	private BigDecimal amount;
	/**
	 * Tipo de transacción
	 */
	private TransactionTypes type;
	/**
	 * Hash de validación de la transacción.
	 */
	@JsonIgnore
	private String hash;
	/**
	 * Identificador de la transacción previa.
	 */
	private int previusTransactionId;

	/**
	 * Retorna el identificador de la transacción
	 * 
	 * @return
	 */
	public int getId() {
		return id;
	}

	/**
	 * Asigna el identificador de la transacción.
	 * 
	 * @param id
	 */
	public void setId(int id) {
		this.id = id;
	}

	/**
	 * Retorna el identificador del bono sobre el cual se realiza la transacción
	 * 
	 * @return
	 */
	public int getBondId() {
		return bondId;
	}

	/**
	 * Asigna el ID del bono sobre el cual se realiza la transacción.
	 * 
	 * @param bondId
	 */
	public void setBondId(int bondId) {
		this.bondId = bondId;
	}

	/**
	 * Retorna la identificación del usuario que realiza la transacción.
	 * 
	 * @return
	 */
	public String getUserId() {
		return userId;
	}

	/**
	 * Asigna el ID del usuario que realiza la transacción.
	 * 
	 * @param userId
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}

	/**
	 * Retorna el monto de la transacción
	 * 
	 * @return
	 */
	public BigDecimal getAmount() {
		return amount;
	}

	/**
	 * Asigna el monto de la transacción
	 * 
	 * @param amount
	 */
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	/**
	 * Reporta el tipo de transacción
	 * 
	 * @return
	 */
	public TransactionTypes getType() {
		return type;
	}

	/**
	 * Asigna el tipo de transacción
	 * 
	 * @param type
	 */
	public void setType(TransactionTypes type) {
		this.type = type;
	}

	/**
	 * Retorna el hash de validación de la transacción
	 * 
	 * @return
	 */
	public String getHash() {
		return hash;
	}

	/**
	 * Asigna el Hash de validación de la transacción
	 * 
	 * @param hash
	 */
	public void setHash(String hash) {
		this.hash = hash;
	}

	/**
	 * Obtiene el ID de la transacción previa
	 * 
	 * @return
	 */
	public int getPreviusTransactionId() {
		return previusTransactionId;
	}

	/**
	 * Asigna el ID de la transacción previa
	 * 
	 * @param previusTransactionId
	 */
	public void setPreviusTransactionId(int previusTransactionId) {
		this.previusTransactionId = previusTransactionId;
	}

}
