package htj.questionservice.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import htj.questionservice.service.ExceptionHandler;
import htj.questionservice.service.TokenValidator;
import htj.questionservice.model.Question;
import htj.questionservice.model.ResponseWrapper;
import htj.questionservice.service.QuestionService;

@Controller
@RequestMapping(value = "/question-service/questions")
public class QuestionRestController {

	private final Logger logger = LoggerFactory.getLogger(QuestionRestController.class);
	QuestionService questionServ;
	private static final String MSG_GET_SUCCESS = "Resource sent.";
	private static final String MSG_ADD_SUCCESS = "Resource added.";
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String MSG_DELETE_SUCCESS = "Resource deleted.";
	private static final String AUTH_HEADER = "Authorization";
	private final TokenValidator tokenValidator;
	private final ExceptionHandler exceptionHandler;

	@Value("${url.auth-service}")
	private String urlAuthService;

	@Autowired
	public QuestionRestController(QuestionService questionServ, TokenValidator tokenValidator,
			ExceptionHandler exceptionHandler) {
		super();
		this.questionServ = questionServ;
		this.tokenValidator = tokenValidator;
		this.exceptionHandler = exceptionHandler;
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<List<Question>>> getQuestions(
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "archived", required = false) Boolean archived,
			@RequestParam(value = "questionnaireId", required = false) Integer questionnaireId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			List<Question> questions;
			
			if (archived != null && questionnaireId != null && questionnaireId > 0) {
				questions = questionServ.getAllArchivedAndQuestionnaireId(archived, questionnaireId);
			} else if (archived != null && questionnaireId == null) {
				questions = questionServ.getAllByArchived(archived);
			} else {
				questions = questionServ.getAllQuestions();
			}

			return ResponseEntity.ok(new ResponseWrapper<>(questions, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@GetMapping("/{questionId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Question>> getQuestionById(@RequestHeader("Authorization") String authorizationHeader,
			@PathVariable int questionId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question question = questionServ.getQuestionById(questionId);
			if (question != null) {
				logger.info(MSG_GET_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(question, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	/*@GetMapping("/copyable")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<List<Question>>> getAllCopyableQuestions(
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "questionnaireId") int questionnaireId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			List<Question> copyableQuestions = questionServ.getAllThatCanBeCopied(questionnaireId, false);
			logger.info("Sending the list of Question objects that can be copied.");
			return ResponseEntity.ok(new ResponseWrapper<>(copyableQuestions, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}*/
	
	@PostMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Question>> addQuestion(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@RequestBody Question question) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question addedQuestion = questionServ.addQuestion(question);
			logger.info(MSG_ADD_SUCCESS);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseWrapper<>(addedQuestion, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}
	
	@PutMapping("/{questionId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Question>> updateQuestion(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int questionId, @RequestBody Question updatedQuestion) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question existingQuestion = questionServ.getQuestionById(questionId);
			if (existingQuestion != null) {
				questionServ.updateQuestion(updatedQuestion);
				logger.info(MSG_UPDATE_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(existingQuestion, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}
	
	@DeleteMapping("/{questionId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteQuestion(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int questionId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question existingQuestion = questionServ.getQuestionById(questionId);
			if (existingQuestion != null) {
				questionServ.deleteQuestion(existingQuestion);
				logger.info(MSG_DELETE_SUCCESS);
				String successMessage = "Question with ID " + questionId + " deleted successfully.";
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