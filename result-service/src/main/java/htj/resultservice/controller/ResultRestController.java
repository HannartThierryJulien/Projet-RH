package htj.resultservice.controller;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import htj.resultservice.model.ResponseWrapper;
import htj.resultservice.model.Result;
import htj.resultservice.service.ExceptionHandler;
import htj.resultservice.service.ResultService;
import htj.resultservice.service.TokenValidator;

@Controller
@RequestMapping(value = "/result-service/results")
public class ResultRestController {
	
    private final Logger logger = LoggerFactory.getLogger(ResultRestController.class);
    private static final String MSG_GET_SUCCESS = "Resource sent.";
	private static final String MSG_ADD_SUCCESS = "Resource added.";
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String MSG_DELETE_SUCCESS = "Resource deleted.";
	private static final String AUTH_HEADER = "Authorization";
	private final ResultService resultServ;
	private final TokenValidator tokenValidator;
	private final ExceptionHandler exceptionHandler;

	@Autowired
	public ResultRestController(ResultService resultServ, TokenValidator tokenValidator,
			ExceptionHandler exceptionHandler) {
		super();
		this.resultServ = resultServ;
		this.tokenValidator = tokenValidator;
		this.exceptionHandler = exceptionHandler;
	}

	@GetMapping
	@ResponseBody
    public ResponseEntity<ResponseWrapper<List<Result>>> getResults(
    		@RequestHeader("Authorization") String authorizationHeader,
    		@RequestParam(value = "candidate_testId", required = false) Integer candidate_testId,
    		@RequestParam(value = "testId", required = false) Integer testId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			List<Result> results = new ArrayList<>();

            if (candidate_testId != null) {
                results = resultServ.getAllByCandidate_testId(candidate_testId);
            } else if (testId != null) {
                results = resultServ.getAllByTestId(testId);
            }

            if (results.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
			
			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(results, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
    }
	
	@GetMapping("/{resultId}")
    @ResponseBody
    public ResponseEntity<ResponseWrapper<Result>> getResultById(
    		@RequestHeader("Authorization") String authorizationHeader,
    		@PathVariable int resultId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Result result = resultServ.getById(resultId);
			if (result != null) {
				logger.info(MSG_GET_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(result, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
    }

	@DeleteMapping("/{resultId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteResult(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int resultId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Result existingResult = resultServ.getById(resultId);
			if (existingResult != null) {
				resultServ.delete(existingResult);
				logger.info(MSG_DELETE_SUCCESS);
				String successMessage = "Result with ID " + resultId + " deleted successfully.";
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