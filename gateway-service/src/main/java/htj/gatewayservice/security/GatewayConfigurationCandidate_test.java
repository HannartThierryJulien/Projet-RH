package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import htj.gatewayservice.filter.AuthenticationFilter;

@Configuration
public class GatewayConfigurationCandidate_test {
	
	@Value("${url.candidate_test-service}")
	private String candidate_testsService;
	
	@Autowired
    private AuthenticationFilter authFilter;
    
    @Bean
    public RouteLocator customRouteLocatorCandidate_test(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		.route("route_0_to_candidate_test-service", r -> r
                        .path("/aubay-HRProject/candidate_tests")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject", "/candidate_test-service"))
                        .uri(candidate_testsService))
        		
        		.route("route_1_to_candidate_test-service", r -> r
                        .path("/aubay-HRProject/candidate_tests/**")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject/candidate_tests", "/candidate_test-service/candidate_tests"))
                        .uri(candidate_testsService))
                
                
                .build();
    }
}
