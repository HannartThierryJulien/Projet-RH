package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import htj.gatewayservice.filter.AuthenticationFilter;

@Configuration
public class GatewayConfigurationQuestion_test {
	
	@Value("${url.question_test-service}")
	private String question_testsService;
	
	@Autowired
    private AuthenticationFilter authFilter;
    
    @Bean
    public RouteLocator customRouteLocatorQuestion_test(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		.route("route_0_to_question_test-service", r -> r
                        .path("/aubay-HRProject/question_tests")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject", "/question_test-service"))
                        .uri(question_testsService))
        		
        		.route("route_1_to_question_test-service", r -> r
                        .path("/aubay-HRProject/question_tests/**")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject/question_tests", "/question_test-service/question_tests"))
                        .uri(question_testsService))
        		
                .build();
    }
}
