package htj.candidate_testservice.controller;

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

import htj.candidate_testservice.model.Candidate_test;
import htj.candidate_testservice.model.ResponseWrapper;
import htj.candidate_testservice.service.Candidate_testService;
import htj.candidate_testservice.service.ExceptionHandler;
import htj.candidate_testservice.service.TokenValidator;

@Controller
@RequestMapping(value = "/candidate_test-service/candidate_tests")
public class Candidate_testControllerRest {

	private final Logger logger = LoggerFactory.getLogger(Candidate_testControllerRest.class);
	private static final String MSG_GET_SUCCESS = "Resource sent.";
	private static final String MSG_ADD_SUCCESS = "Resource added.";
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String MSG_DELETE_SUCCESS = "Resource deleted.";
	private static final String AUTH_HEADER = "Authorization";
	Candidate_testService candidate_testServ;
	private final TokenValidator tokenValidator;
	private final ExceptionHandler exceptionHandler;

	@Autowired
	public Candidate_testControllerRest(Candidate_testService candidate_testServ, TokenValidator tokenValidator,
			ExceptionHandler exceptionHandler) {
		super();
		this.candidate_testServ = candidate_testServ;
		this.tokenValidator = tokenValidator;
		this.exceptionHandler = exceptionHandler;
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<List<Candidate_test>>> getAllCandidate_testByCandidate(
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "candidateId", required = false) Integer candidateId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			List<Candidate_test> listCandidateTest = null;
			if (candidateId != null) {
				listCandidateTest = candidate_testServ.getAllByCandidateId(candidateId);
			}

			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(listCandidateTest, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}
	
	@GetMapping("/bytest")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<List<Candidate_test>>> getAllCandidate_testByTestId(
	        @RequestHeader("Authorization") String authorizationHeader,
	        @RequestParam("testId") int testId) {
	    try {
	        tokenValidator.validateAuthorizationHeader(authorizationHeader);

	        List<Candidate_test> listCandidateTest = candidate_testServ.getAllByTestId(testId);

	        logger.info(MSG_GET_SUCCESS);
	        return ResponseEntity.ok(new ResponseWrapper<>(listCandidateTest, null));
	    } catch (AccessDeniedException e) {
	        return exceptionHandler.handleAccessDeniedException(e);
	    } catch (Exception e) {
	        return exceptionHandler.handleInternalServerError(e);
	    }
	}


	@GetMapping("/{candidate_testId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Object>> getCandidate_testById(
			@RequestHeader("Authorization") String authorizationHeader, @PathVariable int candidate_testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Candidate_test candidate_test = candidate_testServ.getById(candidate_testId);

			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(candidate_test, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PostMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Candidate_test>> addCandidate_test(
			@RequestHeader(AUTH_HEADER) String authorizationHeader, @RequestBody Candidate_test candidate_test) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);
			System.out.println("candidate_test.assignedAt = " + candidate_test.getAssignedAt());
			Candidate_test addedCandidate_test = candidate_testServ.add(candidate_test);
			System.out.println("addedCandidate_test.assignedAt = " + addedCandidate_test.getAssignedAt());
			logger.info(MSG_ADD_SUCCESS);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseWrapper<>(addedCandidate_test, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PutMapping("/{candidate_testId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Candidate_test>> updateCandidate_test(
			@RequestHeader(AUTH_HEADER) String authorizationHeader, @PathVariable int candidate_testId,
			@RequestBody Candidate_test updatedCandidate_test) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Candidate_test existingCandidate_test = candidate_testServ.getById(candidate_testId);
			if (existingCandidate_test != null) {
				candidate_testServ.update(updatedCandidate_test);
				logger.info(MSG_UPDATE_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(existingCandidate_test, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@DeleteMapping("/{candidate_testId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteCandidate_test(
			@RequestHeader(AUTH_HEADER) String authorizationHeader, @PathVariable int candidate_testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Candidate_test existingCandidate_test = candidate_testServ.getById(candidate_testId);
			if (existingCandidate_test != null) {
				candidate_testServ.delete(existingCandidate_test);
				logger.info(MSG_DELETE_SUCCESS);
				String successMessage = "Candidate_test with ID " + candidate_testId + " deleted successfully.";
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