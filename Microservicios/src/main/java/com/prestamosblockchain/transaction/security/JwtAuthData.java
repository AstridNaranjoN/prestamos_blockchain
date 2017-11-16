package com.prestamosblockchain.transaction.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.jwt.Jwt;
import org.springframework.security.jwt.JwtHelper;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Clase que almacena la informaci�n sobre el usario enviada en el JWT.
 * 
 * @author Juan Mari�o
 *
 */
public class JwtAuthData implements UserDetails {

	/**
	 * Almacena la informaci�n del cuerpo del Jwt autenticado.
	 */
	@SuppressWarnings("unchecked")
	private Map<String, String> claimsData;

	/**
	 * Constructor.
	 * 
	 * @param tokenId
	 *            {@link String} con el token id.
	 */
	public JwtAuthData(String tokenId) {
		Jwt jktData = JwtHelper.decode(tokenId);
		try {
			this.claimsData = new ObjectMapper().readValue(jktData.getClaims(), Map.class);
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Retorna la informaci�n del Jwt autenticado.
	 * 
	 * @return {@link Map} con la informaci�n en el cuerpo del JWT.
	 */
	public Map<String, String> getClaimsData() {
		return claimsData;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return this.claimsData.get("email");
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
