package htj.authservice.temp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
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
			.anyRequest().permitAll()  // Permet l'accès à toutes les requêtes
		)
		.csrf((csrf) -> csrf.disable());  // Désactive la protection CSRF (si nécessaire)

	return http.build();
	}
	
}