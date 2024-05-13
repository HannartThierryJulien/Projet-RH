package htj.testservice.controller;

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

import htj.testservice.service.ExceptionHandler;
import htj.testservice.service.TokenValidator;
import htj.testservice.model.Test;
import htj.testservice.model.ResponseWrapper;
import htj.testservice.service.TestService;

@Controller
@RequestMapping(value = "/test-service/tests")
public class TestRestController {
	
    private final Logger logger = LoggerFactory.getLogger(TestRestController.class);
    private static final String MSG_GET_SUCCESS = "Resource sent.";
	private static final String MSG_ADD_SUCCESS = "Resource added.";
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String MSG_DELETE_SUCCESS = "Resource deleted.";
	private static final String AUTH_HEADER = "Authorization";
	private final TestService testServ;
	private final TokenValidator tokenValidator;
	private final ExceptionHandler exceptionHandler;

	@Autowired
	public TestRestController(TestService testServ, TokenValidator tokenValidator, ExceptionHandler exceptionHandler) {
		super();
		this.testServ = testServ;
		this.tokenValidator = tokenValidator;
		this.exceptionHandler = exceptionHandler;
	}

	@GetMapping
	@ResponseBody
    public ResponseEntity<ResponseWrapper<List<Test>>> getAllTests(
    		@RequestHeader("Authorization") String authorizationHeader,
    		@RequestParam(value = "archived", required = false) Boolean archived) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			List<Test> tests;
			if (archived != null) {
				tests = testServ.getAllByArchived(archived);
			} else {
				tests = testServ.getAll();
			}
			
			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(tests, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
    }	
	
	@GetMapping("/{testId}")
    @ResponseBody
    public ResponseEntity<ResponseWrapper<Test>> getTestById(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Test test = testServ.getById(testId);
			if(test == null) {
				return exceptionHandler.handleResourceNotFound();
			}
			
			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(test, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
    }

	@PostMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Test>> addTest(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@RequestBody Test test) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Test addedTest = testServ.add(test);
			logger.info(MSG_ADD_SUCCESS);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseWrapper<>(addedTest, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PutMapping("/{testId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Test>> updateTest(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int testId, @RequestBody Test updatedTest) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Test existingTest = testServ.getById(testId);
			if (existingTest != null) {
				testServ.update(updatedTest);
				logger.info(MSG_UPDATE_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(existingTest, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@DeleteMapping("/{testId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteTest(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Test existingTest = testServ.getById(testId);
			if (existingTest != null) {
				testServ.delete(existingTest);
				logger.info(MSG_DELETE_SUCCESS);
				String successMessage = "Test with ID " + testId + " deleted successfully.";
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