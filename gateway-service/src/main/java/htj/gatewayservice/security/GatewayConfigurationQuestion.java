package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import htj.gatewayservice.filter.AuthenticationFilter;

@Configuration
public class GatewayConfigurationQuestion {
	
	@Value("${url.question-service}")
	private String questionsService;
	
	@Autowired
    private AuthenticationFilter authFilter;
    
    @Bean
    public RouteLocator customRouteLocatorQuestion(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		.route("route_0_to_question-service", r -> r
                        .path("/aubay-HRProject/questions")
                        .filters(f -> f
                        		.filter(authFilter)
                        		.rewritePath("/aubay-HRProject", "/question-service"))
                        .uri(questionsService))
        		
        		.route("route_1_to_question-service", r -> r
                        .path("/aubay-HRProject/questions/**")
                        .filters(f -> f
                        		.filter(authFilter)
                        		.rewritePath("/aubay-HRProject/questions", "/question-service/questions"))
                        .uri(questionsService))
                
                .build();
    }
}
