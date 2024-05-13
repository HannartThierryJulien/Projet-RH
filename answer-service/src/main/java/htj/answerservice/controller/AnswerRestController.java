package htj.answerservice.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.bind.annotation.RestController;

import htj.answerservice.model.Answer;
import htj.answerservice.model.ResponseWrapper;
import htj.answerservice.service.AnswerService;
import htj.answerservice.service.ExceptionHandler;
import htj.answerservice.service.TokenValidator;

@RestController
@RequestMapping(value = "/answer-service/answers")
public class AnswerRestController {

	private final Logger logger = LoggerFactory.getLogger(AnswerRestController.class);
	private static final String MSG_GET_SUCCESS = "Resource sent.";
	private static final String MSG_ADD_SUCCESS = "Resource added.";
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String MSG_DELETE_SUCCESS = "Resource deleted.";
	private static final String AUTH_HEADER = "Authorization";
	private final AnswerService answerServ;
	private final TokenValidator tokenValidator;
	private final ExceptionHandler exceptionHandler;

	@Autowired
	public AnswerRestController(AnswerService answerServ, TokenValidator tokenValidator,
			ExceptionHandler exceptionHandler) {
		this.answerServ = answerServ;
		this.tokenValidator = tokenValidator;
		this.exceptionHandler = exceptionHandler;
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<List<Answer>>> getAllAnswers(
			@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@RequestParam(value = "questionId", required = false) Integer questionId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			List<Answer> answers;
			if (questionId != null) {
				answers = answerServ.getAllAnswersByQuestionId(questionId);
			} else {
				answers = answerServ.getAllAnswers();
			}
			
			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(answers, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@GetMapping("/{answerId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Answer>> getAnswerById(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int answerId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);
			
			Answer answer = answerServ.getAnswerById(answerId);
			if (answer == null) {
				return exceptionHandler.handleResourceNotFound();
			}
			
			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(answer, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PostMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Answer>> addAnswer(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@RequestBody Answer answer) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Answer addedAnswer = answerServ.addAnswer(answer);
			logger.info(MSG_ADD_SUCCESS);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseWrapper<>(addedAnswer, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PutMapping("/{answerId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Answer>> updateAnswer(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int answerId, @RequestBody Answer updatedAnswer) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Answer existingAnswer = answerServ.getAnswerById(answerId);
			if (existingAnswer != null) {
				answerServ.updateAnswer(updatedAnswer);
				logger.info(MSG_UPDATE_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(existingAnswer, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@DeleteMapping("/{answerId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteAnswer(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int answerId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Answer existingAnswer = answerServ.getAnswerById(answerId);
			if (existingAnswer != null) {
				answerServ.deleteAnswer(existingAnswer);
				logger.info(MSG_DELETE_SUCCESS);
				String successMessage = "Answer with ID " + answerId + " deleted successfully.";
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