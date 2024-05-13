package htj.authservice.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import htj.authservice.jwt.JwtUtils;
import htj.authservice.model.Candidate;
import htj.authservice.model.HRManager;
import htj.authservice.model.Person;
import htj.authservice.service.CandidateService;
import htj.authservice.service.HRManagerService;
import htj.authservice.service.PersonService;
import io.jsonwebtoken.io.IOException;

@Controller
@RequestMapping(value = "/auth-service")
//@CrossOrigin(origins = "http://localhost:4200") // à retire après le dvlpmt !
public class AuthController {
	private static final String AUTH_HEADER = "Authorization";
	
	@Autowired
	private PersonService persServ;

	@Autowired
	private CandidateService candidateServ;

	@Autowired
	private HRManagerService hrManagerServ;

	@Autowired
	private JwtUtils jwtUtils;
	
	@PostMapping("/signup")
	@ResponseBody
	public ResponseEntity<Object> signupCandidate(@RequestBody Map<String, String> candidateData) {
		String lastname = candidateData.get("lastname");
		String firstname = candidateData.get("firstname");
		String username = candidateData.get("username");
	    String password = candidateData.get("password");
	    String userRole = null;
	    

	    if (usernameExists(username)) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
	    }
	    
	    Person newPerson = new Person(lastname, firstname, "", true);
	    try {
	    	persServ.addPerson(newPerson);
	    } catch (IOException ie) {
	        ie.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	    
	    Candidate newCandidate = new Candidate(username, password, null, null, null, true, newPerson);
	    try {
	    	candidateServ.addCandidate(newCandidate);
	    	userRole = "candidate";
	    } catch (IOException ie) {
	        ie.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }

	    try {
			String token = jwtUtils.generateTokenResponse(newCandidate.getId(), newCandidate.getMail(), userRole);
			Map<String, String> tokenData = new HashMap<>();
			tokenData.put("token", token);
			return ResponseEntity.status(HttpStatus.CREATED).body(tokenData);
		} catch (IOException ie) {
			ie.printStackTrace();
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	private boolean usernameExists(String username) {
	    return candidateServ.getByMail(username).isPresent() || hrManagerServ.getByMail(username).isPresent();
	}

	@PostMapping("/login")
	@ResponseBody
	public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> user) {
		String userName = user.get("username");
		String password = user.get("password");

		Object userObject = isUsernameAndPasswordMatch(userName, password);

		if (userObject == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		String token = "";
		if (userObject instanceof Candidate) {
	        Candidate candidate = (Candidate) userObject;
	        token = jwtUtils.generateTokenResponse(candidate.getId(), userName, "candidate");
	    } else if (userObject instanceof HRManager) {
	        HRManager hrManager = (HRManager) userObject;
	        token = jwtUtils.generateTokenResponse(hrManager.getId(), userName, "hrManager");
	    }
		
		try {
			Map<String, String> tokenData = new HashMap<>();
			tokenData.put("token", token);
			return ResponseEntity.status(HttpStatus.ACCEPTED).body(tokenData);
		} catch (IOException ie) {
			ie.printStackTrace();
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}
	
	@GetMapping("/validate-jwt")
    public ResponseEntity<Boolean> validateJwt(@RequestHeader(AUTH_HEADER) String jwt) {
		if ((jwtUtils.isExpired(jwt)) || (!jwtUtils.isValidToken(jwt))) {
			return ResponseEntity.ok(false);
		}
		
		return ResponseEntity.ok(true);
    }

	private Object isUsernameAndPasswordMatch(String username, String password) {

		Optional<Candidate> candidate = candidateServ.getByMail(username);
		if (candidate.isPresent() && doesPasswordMatch(password, candidate.get().getPassword())) {
			return candidate.get();
		}

		Optional<HRManager> hrManager = hrManagerServ.getByMail(username);
		if (hrManager.isPresent() && doesPasswordMatch(password, hrManager.get().getPassword())) {
			return hrManager.get();
		}

		return null;
	}
	
	private boolean doesPasswordMatch(String rawPassword, String storedPassword) {
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		return passwordEncoder.matches(rawPassword, storedPassword);
	}
	
}
