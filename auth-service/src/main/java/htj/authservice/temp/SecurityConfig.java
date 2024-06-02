package htj.authservice.temp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Bean
	public PasswordEncoder candidateEncoder() {
	    return new BCryptPasswordEncoder();
	}
	
	@Bean
	@Primary
	public SecurityFilterChain candidateSecurityFilterChain(HttpSecurity http) throws Exception {
		http
		.authorizeHttpRequests((requests) -> requests
			// Permet l'accès à toutes les requêtes
			.anyRequest().permitAll()
		)
		// Désactive la protection CSRF (si nécessaire)
		.csrf((csrf) -> csrf.disable());

	return http.build();
	}
	
}