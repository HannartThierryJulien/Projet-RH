package htj.gatewayservice.filter;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.support.SendResult;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import htj.gatewayservice.kafka.KafkaProducer;
import reactor.core.publisher.Mono;

@Component
public abstract class AbstractFilter<T> implements GatewayFilter {
    private final KafkaProducer kafkaProducer;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final String addTopic;
    private final String updateTopic;
    private final String deleteTopic;

    public AbstractFilter(KafkaProducer kafkaProducer, String addTopic, String updateTopic, String deleteTopic) {
        this.kafkaProducer = kafkaProducer;
        this.addTopic = addTopic;
        this.updateTopic = updateTopic;
        this.deleteTopic = deleteTopic;
    }
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        HttpMethod method = request.getMethod();
      

        if (method == HttpMethod.POST) {
            return handleRequest(exchange, addTopic, chain);
        } else if (method == HttpMethod.PUT) {
        	return handleRequest(exchange, updateTopic, chain);
        } else if (method == HttpMethod.DELETE) {
            return handleDeleteRequest(exchange, deleteTopic, chain);
        } else {
            return chain.filter(exchange);
        }
    }

    protected Mono<Void> handleRequest(ServerWebExchange exchange, String topic, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        return DataBufferUtils.join(request.getBody()).flatMap(dataBuffer -> {
            byte[] bytes = new byte[dataBuffer.readableByteCount()];
            dataBuffer.read(bytes);
            DataBufferUtils.release(dataBuffer);
            String requestBody = new String(bytes);

            logger.info("Request Body for {}: {}", request.getMethod(), requestBody);

            boolean sendResult = kafkaProducer.sendMessage(requestBody, topic);
            if (sendResult) {
                return chain.filter(exchange);
            } else {
                return sendKafkaErrorResponse(exchange);
            }
        });
    }

    protected Mono<Void> handleDeleteRequest(ServerWebExchange exchange, String topic, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String requestPath = request.getURI().getPath();

        if (shouldHandleDelete(requestPath)) {
            String id = extractId(requestPath);
			boolean sendResult = kafkaProducer.sendMessage(id, topic);
            if (sendResult) {
                return chain.filter(exchange);
            } else {
                return sendKafkaErrorResponse(exchange);
            }
        }

        return chain.filter(exchange);
    }

    protected abstract boolean shouldHandleDelete(String requestPath);

    protected abstract String extractId(String requestPath);
    
    private Mono<Void> sendKafkaErrorResponse(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Erreur lors de l'envoi du message à Kafka");

        DataBuffer buffer = response.bufferFactory().wrap(errorResponse.toString().getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }
}

