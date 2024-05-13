package htj.authservice.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtUtils {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration}")
	private String expiration;

	private Key key;

	@PostConstruct
	public void initKey() {
		this.key = Keys.hmacShaKeyFor(secret.getBytes());
	}

	public Claims getClaims(String token) {
		try {
			return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
		} catch (JwtException | IllegalArgumentException e) {
			// jeton invalide ou mal formé
			return null;
		}
	}

	public boolean isValidToken(String token) {
		Claims claims = getClaims(token);
		if (claims == null) {
			return false;
		}

		return !isExpired(token);
	}

	public boolean isExpired(String token) {
		try {
			return getClaims(token).getExpiration().before(new Date());
		} catch (Exception e) {
			return false;
		}
	}

	public String generateTokenResponse(int id, String username, String role) {
		Map<String, String> claims = Map.of("id", String.valueOf(id), "email", username, "role", role);
		;
		long expMillis = Long.parseLong(expiration) * 1000;

		final Date now = new Date();
		final Date exp = new Date(now.getTime() + expMillis);

		initKey();
		
		return Jwts.builder().setClaims(claims)
				// .setSubject(claims.get("id"))
				.setIssuedAt(now).setExpiration(exp).signWith(key).compact();
	}
}