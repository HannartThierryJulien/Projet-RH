package htj.authservice.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import htj.authservice.model.Candidate;
import htj.authservice.repository.CandidateRepository;

@Service
public class CandidateService {

	@Autowired
	private CandidateRepository candidateRep;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	
	public CandidateService() {
	}
	
	public Optional<Candidate> getByMail(String mail) {
		return candidateRep.findByMail(mail);
	}
	
	public Candidate getById(int id) {
		return candidateRep.findById(id);
	}
	
	public ArrayList<Candidate> getAllCandidates() {
		return (ArrayList<Candidate>) candidateRep.findAll();
	}
	
	public ArrayList<Candidate> getAllCandidatesByArchived(boolean archived) {
		return (ArrayList<Candidate>) candidateRep.findAllByArchived(archived);
	}
	
	public Candidate addCandidate(Candidate candidate) {
		candidate.setPassword(passwordEncoder.encode(candidate.getPassword()));
		
		Candidate cand = candidateRep.save(candidate);
		return cand;
	}
	
	public Candidate updateCandidate(Candidate candidate) {
		Candidate candidate1 = candidateRep.save(candidate);
		return candidate1;
	}
	
}
