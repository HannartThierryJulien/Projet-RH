package htj.questionnaireservice.controller;

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

import htj.questionnaireservice.model.Questionnaire;
import htj.questionnaireservice.model.ResponseWrapper;
import htj.questionnaireservice.service.ExceptionHandler;
import htj.questionnaireservice.service.QuestionnaireService;
import htj.questionnaireservice.service.TokenValidator;

@Controller
@RequestMapping(value = "/questionnaire-service/questionnaires")
public class QuestionnaireControllerRest {

	private final Logger logger = LoggerFactory.getLogger(QuestionnaireControllerRest.class);
	private static final String MSG_GET_SUCCESS = "Resource sent.";
	private static final String MSG_ADD_SUCCESS = "Resource added.";
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String MSG_DELETE_SUCCESS = "Resource deleted.";
	private static final String AUTH_HEADER = "Authorization";
	QuestionnaireService questionnaireServ;
	private final TokenValidator tokenValidator;
	private final ExceptionHandler exceptionHandler;

	@Autowired
	public QuestionnaireControllerRest(QuestionnaireService questionnaireServ, TokenValidator tokenValidator,
			ExceptionHandler exceptionHandler) {
		super();
		this.questionnaireServ = questionnaireServ;
		this.tokenValidator = tokenValidator;
		this.exceptionHandler = exceptionHandler;
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Object>> getAllQuestionnairesByCandidate_test(
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "archived", required = false) Boolean archived) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			List<Questionnaire> questionnaires;
			if (archived != null && archived) {
				questionnaires = questionnaireServ.getAllByArchived(true);
			} else if (archived != null && !archived) {
				questionnaires = questionnaireServ.getAllByArchived(false);
			} else {
				questionnaires = questionnaireServ.getAll();
			}

			logger.info(MSG_GET_SUCCESS);
			return ResponseEntity.ok(new ResponseWrapper<>(questionnaires, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@GetMapping("/{questionnaireId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Questionnaire>> getQuestionnaireById(
			@RequestHeader("Authorization") String authorizationHeader, @PathVariable int questionnaireId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Questionnaire questionnaire = questionnaireServ.getById(questionnaireId);
			if (questionnaire != null) {
				logger.info(MSG_GET_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(questionnaire, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}
	
	@GetMapping("/bylabel")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Questionnaire>> getQuestionnaireByLabel(
	        @RequestHeader("Authorization") String authorizationHeader,
	        @RequestParam("label") String label) {
	    try {
	        tokenValidator.validateAuthorizationHeader(authorizationHeader);

	        Questionnaire questionnaire = questionnaireServ.getByLabel(label);
	        if (questionnaire != null) {
	            logger.info(MSG_GET_SUCCESS);
	            return ResponseEntity.ok(new ResponseWrapper<>(questionnaire, null));
	        } else {
	        	//cas particulier, ici on ne veut pas que l'erreur notFound soit levée (cf. classe TestController, méthode addQuestionToTest)
	            //return exceptionHandler.handleResourceNotFound();
	            return ResponseEntity.ok(new ResponseWrapper<>(null, "Resource not found."));
	        }
	    } catch (AccessDeniedException e) {
	        return exceptionHandler.handleAccessDeniedException(e);
	    } catch (Exception e) {
	        return exceptionHandler.handleInternalServerError(e);
	    }
	}

	
	@PostMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Questionnaire>> addQuestionnaire(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@RequestBody Questionnaire questionnaire) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Questionnaire addedQuestionnaire = questionnaireServ.add(questionnaire);
			logger.info(MSG_ADD_SUCCESS);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseWrapper<>(addedQuestionnaire, null));
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@PutMapping("/{questionnaireId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Questionnaire>> updateQuestionnaire(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int questionnaireId, @RequestBody Questionnaire updatedQuestionnaire) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Questionnaire existingQuestionnaire = questionnaireServ.getById(questionnaireId);
			if (existingQuestionnaire != null) {
				questionnaireServ.update(updatedQuestionnaire);
				logger.info(MSG_UPDATE_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(existingQuestionnaire, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (AccessDeniedException e) {
			return exceptionHandler.handleAccessDeniedException(e);
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

	@DeleteMapping("/{questionnaireId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteQuestionnaire(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int questionnaireId) {
		try {
			tokenValidator.validateAuthorizationHeader(authorizationHeader);

			Questionnaire existingQuestionnaire = questionnaireServ.getById(questionnaireId);
			if (existingQuestionnaire != null) {
				questionnaireServ.delete(existingQuestionnaire);
				logger.info(MSG_DELETE_SUCCESS);
				String successMessage = "Questionnaire with ID " + questionnaireId + " deleted successfully.";
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