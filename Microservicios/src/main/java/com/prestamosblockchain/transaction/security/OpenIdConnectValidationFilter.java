package com.prestamosblockchain.transaction.security;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

/**
 * Filtro que capturar� las petici�n antes de ser procesados por los servicios
 * para validar la firma del objeto JWT en la petici�n.
 * 
 * @author Juan Mari�o
 *
 */
public class OpenIdConnectValidationFilter extends AbstractAuthenticationProcessingFilter {
	public static String HEADER_PREFIX = "Bearer ";

	public OpenIdConnectValidationFilter(String defaultFilterProcessesUrl) {
		super(defaultFilterProcessesUrl);
		super.setAuthenticationManager(new OpenIdConnectValidationFilter.NoopAuthenticationManager());
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException, IOException, ServletException {
		String autorizationHeader = request.getHeader("X-Authorization");
		String cliendId = request.getHeader("client_id");
		if (autorizationHeader == null || cliendId == null) {
			throw new BadCredentialsException("No se est�n enviando los datos del X-Authorization y/o client_id");
		}
		if (OpenIdConnectValidationFilter.HEADER_PREFIX.length() > autorizationHeader.length()) {
			throw new BadCredentialsException("Valor para X-Authorization no es v�lido");
		}
		if (!autorizationHeader.startsWith(OpenIdConnectValidationFilter.HEADER_PREFIX)) {
			throw new BadCredentialsException("Valor para X-Authorization debe comenzar con \"Bearer \"");
		}
		String tokenId = autorizationHeader.substring(HEADER_PREFIX.length(), autorizationHeader.length());
		GoogleIdTokenVerifier verifier;
		GoogleIdToken googleTokenId = null;
		try {
			verifier = new GoogleIdTokenVerifier.Builder(GoogleNetHttpTransport.newTrustedTransport(),
					JacksonFactory.getDefaultInstance()).setAudience(Collections.singletonList(cliendId)).build();
			googleTokenId = verifier.verify(tokenId);
		} catch (Exception e) {
			throw new BadCredentialsException("Error al verificar firma de JWT: " + e.getMessage(), e);
		}

		if (googleTokenId == null) {
			throw new BadCredentialsException("Token Id no es v�lido");
		}
		JwtAuthData jwtAuthData = new JwtAuthData(tokenId);
		return new UsernamePasswordAuthenticationToken(jwtAuthData, jwtAuthData, jwtAuthData.getAuthorities());
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		SecurityContext context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(authResult);
		SecurityContextHolder.setContext(context);
		chain.doFilter(request, response);
	}

	private static class NoopAuthenticationManager implements AuthenticationManager {

		public Authentication authenticate(Authentication authentication) throws AuthenticationException {
			throw new UnsupportedOperationException("No authentication should be done with this AuthenticationManager");
		}

	}
}
