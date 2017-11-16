package com.prestamosblockchain.transaction;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.prestamosblockchain.transaction.security.OpenIdConnectValidationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	public SecurityConfig() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/resources/**");
		web.ignoring().antMatchers("/");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		final OpenIdConnectValidationFilter filter = new OpenIdConnectValidationFilter("/**");
		// http.cors().disable().exceptionHandling().and().csrf().disable().exceptionHandling().and().sessionManagement()
		// .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
		// .antMatchers("/console").permitAll().and().authorizeRequests().antMatchers("/**").authenticated().and()
		// .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
		http.cors().and().csrf().disable().exceptionHandling().and().sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
				.antMatchers(HttpMethod.OPTIONS, "/**").permitAll().and().authorizeRequests()
				.antMatchers(HttpMethod.POST, "/**").authenticated().and()
				.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class).authorizeRequests().and()
				.authorizeRequests().antMatchers(HttpMethod.GET, "/**").authenticated().and()
				.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class).authorizeRequests()
				.antMatchers(HttpMethod.PUT, "/**").authenticated().and()
				.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class).authorizeRequests();
	}
}
