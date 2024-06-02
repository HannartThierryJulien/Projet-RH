package htj.authservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import htj.authservice.jwt.JwtUtils;
import htj.authservice.model.HRManager;
import htj.authservice.model.ResponseWrapper;
import htj.authservice.service.ExceptionHandler;
import htj.authservice.service.HRManagerService;

@Controller
@RequestMapping(value = "/auth-service/hrmanagers")
public class HRManagerController {

	@Autowired
	private HRManagerService hrManagerServ;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Autowired
	private ExceptionHandler exceptionHandler;
	
	@GetMapping
	@ResponseBody
	public ResponseEntity<ResponseWrapper<List<HRManager>>> getHRManagers(
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "archived", required = false) Boolean archived) {
		try {
			if ((jwtUtils.isExpired(authorizationHeader)) || (!jwtUtils.isValidToken(authorizationHeader))) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		                .body(new ResponseWrapper<>(null, "Error: Invalid token provided in headers."));
			}
			
			
			List<HRManager> hrManagers;
			if (archived != null) {
				hrManagers = hrManagerServ.getAllHRManagersByArchived(archived);
			} else {
				hrManagers = hrManagerServ.getAllHRManagers();
			}

			return ResponseEntity.ok(new ResponseWrapper<>(hrManagers, null));
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}
	
	
	

	@GetMapping("/{hrManagerId}")
	@ResponseBody
	public ResponseEntity<ResponseWrapper<HRManager>> getHRManagerById(@PathVariable int hrManagerId,
			@RequestHeader("Authorization") String authorizationHeader) {
		try {
			if ((jwtUtils.isExpired(authorizationHeader)) || (!jwtUtils.isValidToken(authorizationHeader))) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		                .body(new ResponseWrapper<>(null, "Error: Invalid token provided in headers."));
			}

			HRManager hrManager = hrManagerServ.getById(hrManagerId);
			return ResponseEntity.ok(new ResponseWrapper<>(hrManager, null));
		} catch (Exception e) {
			return exceptionHandler.handleInternalServerError(e);
		}
	}

}
