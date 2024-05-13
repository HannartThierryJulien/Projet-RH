package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import htj.gatewayservice.filter.AuthenticationFilter;

@Configuration
public class GatewayConfigurationTopic {
	
	@Value("${url.topic-service}")
	private String topicsService;
	
	@Autowired
    private AuthenticationFilter authFilter;
    
    @Bean
    public RouteLocator customRouteLocatorTopic(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		.route("route_0_to_topic-service", r -> r
                        .path("/aubay-HRProject/topics")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject", "/topic-service"))
                        .uri(topicsService))
        		
        		.route("route_1_to_topic-service", r -> r
                        .path("/aubay-HRProject/topics/**")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject/topics", "/topic-service/topics"))
                        .uri(topicsService))
                
                
                .build();
    }
}
