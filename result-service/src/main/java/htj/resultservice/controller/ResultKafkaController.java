package htj.resultservice.controller;

import java.util.function.Consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import htj.resultservice.model.Result;
import htj.resultservice.service.ResultService;

@Service
public class ResultKafkaController {
	
	private static final String GROUP_ID = "my-group";
    private static final String TOPIC_ADD = "results_add";
    private final Logger logger = LoggerFactory.getLogger(ResultKafkaController.class);
	private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

	@Autowired
	ResultService resultServ;

	@KafkaListener(topics = TOPIC_ADD, groupId = GROUP_ID)
	public void listenTopicResultsAdd(String message) {
		if(processMessage(message, resultServ::add)) {
			logger.info("Topic " + TOPIC_ADD + " - Message reçu et consommé - Contenu :\n{}", message);
		}
	}

	private boolean processMessage(String message, Consumer<Result> resultServAction) {
		try {
			Result result = objectMapper.readValue(message, Result.class);
			resultServAction.accept(result);
			return true;
		} catch (JsonProcessingException e) {
			logger.error("ERREUR dans la réception de l'objet Result", e);
			return false;
		}
	}
}