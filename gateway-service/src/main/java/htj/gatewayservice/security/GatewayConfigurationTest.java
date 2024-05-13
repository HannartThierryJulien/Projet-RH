package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import htj.gatewayservice.filter.AuthenticationFilter;

@Configuration
public class GatewayConfigurationTest {
	
	@Value("${url.test-service}")
	private String testsService;
	
	@Autowired
    private AuthenticationFilter authFilter;

    
    @Bean
    public RouteLocator customRouteLocatorTest(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		.route("route_0_to_test-service", r -> r
                        .path("/aubay-HRProject/tests")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject", "/test-service"))
                        .uri(testsService))
        		
        		.route("route_1_to_test-service", r -> r
                        .path("/aubay-HRProject/tests/**")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject/tests", "/test-service/tests"))
                        .uri(testsService))
                
                .build();
    }
}
