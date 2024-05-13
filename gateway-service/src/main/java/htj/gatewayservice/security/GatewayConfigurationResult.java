package htj.gatewayservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import htj.gatewayservice.filter.AuthenticationFilter;
import htj.gatewayservice.filter.ResultFilter;

@Configuration
public class GatewayConfigurationResult {
	
	@Value("${url.result-service}")
	private String resultsService;
	
	@Autowired
    private AuthenticationFilter authFilter;
	
	@Autowired
    private ResultFilter resultfilter;
    
    @Bean
    public RouteLocator customRouteLocatorResult(RouteLocatorBuilder builder) {
        return builder.routes()
        		
        		// Redirection requête GET pour plusieurs results vers le result-service
        		.route("route_1_to_result-service", r -> r
                        .method(HttpMethod.GET)
                        .and()
                        .path("/aubay-HRProject/results")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject/results", "/result-service/results"))
                        .uri(resultsService))
        		
        		// Redirection requête GET pour une result vers le result-service
        		.route("route_2_to_result-service", r -> r
                        .method(HttpMethod.GET)
                        .and()
                        .path("/aubay-HRProject/results/{resultId}")
                        .filters(f -> f.filter(authFilter).rewritePath("/aubay-HRProject/results", "/result-service/results"))
                        .uri(resultsService))
        		
        		// Récupération requête POST et traitement avec le filtre
                .route("route_1_to_kafka", r -> r
                		.method(HttpMethod.POST)
                		.and()
                        .path("/aubay-HRProject/results")
                        .filters(f -> f.filter(authFilter).filter(resultfilter))
                        .uri("no://op"))

        		
                // Récupération requête PUT/DELETE et traitement avec le filtre
                .route("route_2_to_kafka", r -> r
                		.method(HttpMethod.PUT, HttpMethod.DELETE)
                		.and()
                        .path("/aubay-HRProject/results/{resultId}")
                        .filters(f -> f.filter(authFilter).filter(resultfilter))
                        .uri("no://op"))
                
                
                .build();
    }
}
