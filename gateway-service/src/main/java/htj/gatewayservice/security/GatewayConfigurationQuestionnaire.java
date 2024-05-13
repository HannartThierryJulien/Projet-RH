package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import htj.gatewayservice.filter.AuthenticationFilter;

@Configuration
public class GatewayConfigurationQuestionnaire {
	
	@Value("${url.questionnaire-service}")
	private String questionnairesService;
	
	@Autowired
    private AuthenticationFilter authFilter;
    
    @Bean
    public RouteLocator customRouteLocatorQuestionnaire(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		.route("route_0_to_questionnaire-service", r -> r
                        .path("/aubay-HRProject/questionnaires")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject", "/questionnaire-service"))
                        .uri(questionnairesService))
        		
        		.route("route_1_to_questionnaire-service", r -> r
                        .path("/aubay-HRProject/questionnaires/**")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject/questionnaires", "/questionnaire-service/questionnaires"))
                        .uri(questionnairesService))
                
                .build();
    }
}
