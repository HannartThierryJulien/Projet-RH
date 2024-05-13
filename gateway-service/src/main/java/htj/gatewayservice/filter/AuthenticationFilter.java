package htj.gatewayservice.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter implements GatewayFilter {
	private static final String URL_ENDPOINT_AUTHSERVICE = "/auth-service/validate-jwt";
	
	@Value("${url.auth-service}")
    private String urlAuthService;
	
	private final RestTemplate restTemplate = new RestTemplate();

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
		
		ServerHttpRequest request = exchange.getRequest();

			if (authMissing(request)) {
				return onError(exchange, HttpStatus.UNAUTHORIZED);
			}

			final String token = request.getHeaders().getOrEmpty("Authorization").get(0);

			if (!isTokenValid(token)) {
				return onError(exchange, HttpStatus.UNAUTHORIZED);
			}

		return chain.filter(exchange);
	}

	private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus) {
		ServerHttpResponse response = exchange.getResponse();
		response.setStatusCode(httpStatus);
		return response.setComplete();
	}

	private boolean authMissing(ServerHttpRequest request) {
		return !request.getHeaders().containsKey("Authorization");
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
            return false;
        } catch (Exception e) {
            return false;
        }
	}
}
