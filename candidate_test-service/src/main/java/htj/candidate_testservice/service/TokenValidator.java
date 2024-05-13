package htj.candidate_testservice.service;

import java.nio.file.AccessDeniedException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class TokenValidator {
	
	private final Logger logger = LoggerFactory.getLogger(TokenValidator.class);
	private final RestTemplate restTemplate;
	private static final String URL_ENDPOINT_AUTHSERVICE = "/auth-service/validate-jwt";
	private static final String ERROR_MESSAGE_NOTOKEN = "Error: No token provided in headers.";
	private static final String ERROR_MESSAGE_INVALIDTOKEN = "Error: Invalid token provided in headers.";
	
	@Value("${url.auth-service}")
	private String urlAuthService;
	
	public TokenValidator(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

	public void validateAuthorizationHeader(String authorizationHeader) throws AccessDeniedException {
		if (!StringUtils.hasText(authorizationHeader)) {
			logger.error(ERROR_MESSAGE_NOTOKEN);
			throw new AccessDeniedException(ERROR_MESSAGE_NOTOKEN);
		}

		if (!isTokenValid(authorizationHeader)) {
			logger.error(ERROR_MESSAGE_INVALIDTOKEN);
			throw new AccessDeniedException(ERROR_MESSAGE_INVALIDTOKEN);
		}
	}

	private boolean isTokenValid(String token) {
		try {
			final RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", token);
			HttpEntity<Boolean> httpEntity = new HttpEntity<>(headers);
			ResponseEntity<Boolean> response = restTemplate.exchange(urlAuthService + URL_ENDPOINT_AUTHSERVICE, HttpMethod.GET, httpEntity, new ParameterizedTypeReference<Boolean>() {
			});
			return response.getBody();
		} catch (HttpClientErrorException.Unauthorized | HttpClientErrorException.NotFound e) {
            logger.error("Token validation failed with HTTP error", e);
            return false;
        } catch (Exception e) {
            logger.error("Error validating token", e);
            return false;
        }
	}

}
