package htj.question_testservice.service;

import java.nio.file.AccessDeniedException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import htj.question_testservice.model.ResponseWrapper;

@Service
public class ExceptionHandler {
	
	private final Logger logger = LoggerFactory.getLogger(ExceptionHandler.class);
	
	public <T> ResponseEntity<ResponseWrapper<T>> handleException(Exception e, HttpStatus status, String defaultMessage) {
		logger.error("Error processing request: {}", e.getMessage(), e);
	    return ResponseEntity.status(status)
	            .body(new ResponseWrapper<>(null, defaultMessage));
	}

	public <T> ResponseEntity<ResponseWrapper<T>> handleAccessDeniedException(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ResponseWrapper<>(null, "Unauthorized access: " + e.getMessage()));
    }

	public <T> ResponseEntity<ResponseWrapper<T>> handleInternalServerError(Exception e) {
        logger.error("Internal server error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseWrapper<>(null, "Internal server error"));
    }
    
	public <T> ResponseEntity<ResponseWrapper<T>> handleResourceNotFound() {
		String notFoundMessage = "Resource not found.";
        logger.error("Error: " + notFoundMessage);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseWrapper<>(null, notFoundMessage));
    }

}
