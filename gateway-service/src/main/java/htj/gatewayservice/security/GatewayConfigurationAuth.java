package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;

@Configuration
public class GatewayConfigurationAuth {
	
	@Value("${url.auth-service}")
	private String authService;
    
    @Bean
    public RouteLocator customRouteLocatorAuth(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		.route("route_0_to_auth-service", r -> r
                        .path("/aubay-HRProject/auth/**")
                        .filters(f -> f.rewritePath("/aubay-HRProject/auth", "/auth-service"))
                        .uri(authService))
                
                .build();
    }
}
