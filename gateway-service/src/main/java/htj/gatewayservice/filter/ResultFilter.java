package htj.gatewayservice.filter;

import org.springframework.stereotype.Component;

import htj.gatewayservice.kafka.KafkaProducer;

@Component
public class ResultFilter extends AbstractFilter<ResultFilter> {
	private static final String TOPIC_ADD = "results_add";
    private static final String TOPIC_UPDATE = "results_update";
    private static final String TOPIC_DELETE = "results_delete";

    public ResultFilter(KafkaProducer kafkaProducer) {
        super(kafkaProducer, TOPIC_ADD, TOPIC_UPDATE, TOPIC_DELETE);
    }

    @Override
    protected boolean shouldHandleDelete(String requestPath) {
        return requestPath.startsWith("/aubay-HRProject/results/");
    }

    @Override
    protected String extractId(String requestPath) {
        return requestPath.substring(requestPath.lastIndexOf('/') + 1);
    }
}

