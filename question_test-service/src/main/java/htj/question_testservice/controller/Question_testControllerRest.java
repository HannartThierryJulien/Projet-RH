package htj.question_testservice.controller;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;

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

import htj.question_testservice.model.Question_test;
import htj.question_testservice.model.ResponseWrapper;
import htj.question_testservice.service.ExceptionHandler;
import htj.question_testservice.service.Question_testService;
import htj.question_testservice.service.TokenValidator;

@Controller
@RequestMapping(value = "/question_test-service/question_tests")
public class Question_testControllerRest {

	private final Logger logger = LoggerFactory.getLogger(Question_testControllerRest.class);
	private static final String MSG_GET_SUCCESS = "Resource sent.";
	private static final String MSG_ADD_SUCCESS = "Resource added.";
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String MSG_DELETE_SUCCESS = "Resource deleted.";
	private static final String AUTH_HEADER = "Authorization";
	Question_testService question_testServ;
	private final TokenValidator tokenValidator;
	private final ExceptionHandler exceptionHandler;

	@Autowired
	public Question_testControllerRest(Question_testService question_testServ, TokenValidator tokenValidator,
			ExceptionHandler exceptionHandler) {
		super();
		this.question_testServ = question_testServ;
		this.tokenValidator = tokenValidator;
		this.exceptionHandler = exceptionHandler;
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<ArrayList<Question_test>>> getAllQuestion_testsByTestId(
			@RequestHeader("Authorization") String authorizationHeader, @RequestParam(value = "testId") int testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			ArrayList<Question_test> question_testList = question_testServ.getAllByTestId(testId);

			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(question_testList, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@GetMapping("/{question_testId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Question_test>> getQuestion_testById(
			@RequestHeader("Authorization") String authorizationHeader, @PathVariable int question_testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question_test question_test = question_testServ.getById(question_testId);

			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(question_test, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PostMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Question_test>> addQuestion_test(
			@RequestHeader(AUTH_HEADER) String authorizationHeader, @RequestBody Question_test question_test) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question_test addedQuestion_test = question_testServ.add(question_test);
			logger.info(MSG_ADD_SUCCESS);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseWrapper<>(addedQuestion_test, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PutMapping("/{question_testId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Question_test>> updateQuestion_test(
			@RequestHeader(AUTH_HEADER) String authorizationHeader, @PathVariable int question_testId,
			@RequestBody Question_test updatedQuestion_test) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question_test existingQuestion_test = question_testServ.getById(question_testId);
			if (existingQuestion_test != null) {
				question_testServ.update(updatedQuestion_test);
				logger.info(MSG_UPDATE_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(existingQuestion_test, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@DeleteMapping("/{question_testId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteQuestion_test(
			@RequestHeader(AUTH_HEADER) String authorizationHeader, @PathVariable int question_testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question_test existingQuestion_test = question_testServ.getById(question_testId);
			if (existingQuestion_test != null) {
				question_testServ.delete(existingQuestion_test);
				logger.info(MSG_DELETE_SUCCESS);
				String successMessage = "Question_test with ID " + question_testId + " deleted successfully.";
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

	@GetMapping("/byquestionandtest")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Question_test>> getQuestion_testByQuestionIdAndTestId(
			@RequestHeader("Authorization") String authorizationHeader, @RequestParam("questionId") int questionId,
			@RequestParam("testId") int testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Question_test question_test = question_testServ.getByQuestionIdAndTestId(questionId, testId);
			if (question_test != null) {
				logger.info(MSG_GET_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(question_test, null));
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