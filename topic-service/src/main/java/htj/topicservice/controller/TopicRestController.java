package htj.topicservice.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import htj.topicservice.model.ResponseWrapper;
import htj.topicservice.model.Topic;
import htj.topicservice.service.ExceptionHandler;
import htj.topicservice.service.TokenValidator;
import htj.topicservice.service.TopicService;

@Controller
@RequestMapping(value = "/topic-service/topics")
public class TopicRestController {

	private final Logger logger = LoggerFactory.getLogger(TopicRestController.class);
	private static final String MSG_GET_SUCCESS = "Resource sent.";
	private static final String MSG_ADD_SUCCESS = "Resource added.";
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String MSG_DELETE_SUCCESS = "Resource deleted.";
	private static final String AUTH_HEADER = "Authorization";
	private final TopicService topicServ;
	private final TokenValidator tokenValidator;
	private final ExceptionHandler exceptionHandler;

	@Autowired
	public TopicRestController(TopicService topicServ, TokenValidator tokenValidator,
			ExceptionHandler exceptionHandler) {
		super();
		this.topicServ = topicServ;
		this.tokenValidator = tokenValidator;
		this.exceptionHandler = exceptionHandler;
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<List<Topic>>> getAllTopics(
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "archived", required = false) Boolean archived) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			List<Topic> topics;
			if (archived != null && archived) {
				topics = topicServ.getAllByArchived(true);
			} else if (archived != null && !archived) {
				topics = topicServ.getAllByArchived(false);
			} else {
				topics = topicServ.getAll();
			}

			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(topics, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@GetMapping("/{topicId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Topic>> getTopicById(
			@RequestHeader("Authorization") String authorizationHeader, @PathVariable int topicId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Topic topic = topicServ.getById(topicId);
			if (topic != null) {
				logger.info(MSG_GET_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(topic, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PostMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Topic>> addTopic(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@RequestBody Topic topic) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Topic addedTopic = topicServ.add(topic);
			logger.info(MSG_ADD_SUCCESS);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseWrapper<>(addedTopic, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PutMapping("/{topicId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Topic>> updateTopic(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int topicId, @RequestBody Topic updatedTopic) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Topic existingTopic = topicServ.getById(topicId);
			if (existingTopic != null) {
				topicServ.update(updatedTopic);
				logger.info(MSG_UPDATE_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(existingTopic, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@DeleteMapping("/{topicId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteTopic(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int topicId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Topic existingTopic = topicServ.getById(topicId);
			if (existingTopic != null) {
				topicServ.delete(existingTopic);
				logger.info(MSG_DELETE_SUCCESS);
				String successMessage = "Topic with ID " + topicId + " deleted successfully.";
				return ResponseEntity.ok(new ResponseWrapper<>(null, successMessage));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

}