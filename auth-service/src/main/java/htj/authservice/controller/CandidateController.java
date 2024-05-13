package htj.authservice.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import htj.authservice.jwt.JwtUtils;
import htj.authservice.model.Candidate;
import htj.authservice.model.ResponseWrapper;
import htj.authservice.service.CandidateService;
import htj.authservice.service.ExceptionHandler;

@Controller
@RequestMapping(value = "/auth-service/candidates")
public class CandidateController {
	private final Logger logger = LoggerFactory.getLogger(CandidateController.class);
	private static final String MSG_UPDATE_SUCCESS = "Resource updated.";
	private static final String AUTH_HEADER = "Authorization";

	@Autowired
	private CandidateService candidateServ;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Autowired
	private ExceptionHandler exceptionHandler;
	
	@GetMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<List<Candidate>>> getCandidates(
			@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@RequestParam(value = "archived", required = false) Boolean archived) {
		try {
			if ((jwtUtils.isExpired(authorizationHeader)) || (!jwtUtils.isValidToken(authorizationHeader))) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		                .body(new ResponseWrapper<>(null, "Error: Invalid token provided in headers."));
			}
			
			
			List<Candidate> candidates;
			if (archived != null) {
				candidates = candidateServ.getAllCandidatesByArchived(archived);
			} else {
				candidates = candidateServ.getAllCandidates();
			}

			return ResponseEntity.ok(new ResponseWrapper<>(candidates, null));
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}


	@GetMapping("/{candidateId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Candidate>> getCandidateById(@PathVariable int candidateId,
			@RequestHeader(AUTH_HEADER) String authorizationHeader) {	
		try {
			if ((jwtUtils.isExpired(authorizationHeader)) || (!jwtUtils.isValidToken(authorizationHeader))) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		                .body(new ResponseWrapper<>(null, "Error: Invalid token provided in headers."));
			}
			
			Candidate candidate = candidateServ.getById(candidateId);
			return ResponseEntity.ok(new ResponseWrapper<>(candidate, null));
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}
	
	@PutMapping("/{candidateId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<Candidate>> updateCandidate(@RequestHeader(AUTH_HEADER) String authorizationHeader,
			@PathVariable int candidateId, @RequestBody Candidate updatedCandidate) {
		try {
			if ((jwtUtils.isExpired(authorizationHeader)) || (!jwtUtils.isValidToken(authorizationHeader))) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		                .body(new ResponseWrapper<>(null, "Error: Invalid token provided in headers."));
			}

			Candidate existingCandidate = candidateServ.getById(candidateId);
			if (existingCandidate != null) {
				updatedCandidate.setPassword(existingCandidate.getPassword());
				candidateServ.updateCandidate(updatedCandidate);
				logger.info(MSG_UPDATE_SUCCESS);
				return ResponseEntity.ok(new ResponseWrapper<>(existingCandidate, null));
			} else {
				return exceptionHandler.handleResourceNotFound();
			}
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

}
