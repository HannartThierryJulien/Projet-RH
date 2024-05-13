package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import htj.gatewayservice.filter.AuthenticationFilter;

@Configuration
public class GatewayConfigurationAnswer {
	
	@Value("${url.answer-service}")
	private String answersService;
	
	@Autowired
    private AuthenticationFilter authFilter;
    
    @Bean
    public RouteLocator customRouteLocatorAnswer(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		.route("route_0_to_answer-service", r -> r
                        .path("/aubay-HRProject/answers")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject", "/answer-service"))
                        .uri(answersService))
        		
        		.route("route_1_to_answer-service", r -> r
                        .path("/aubay-HRProject/answers/**")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject/answers", "/answer-service/answers"))
                        .uri(answersService))  
                
                .build();
    }
}
