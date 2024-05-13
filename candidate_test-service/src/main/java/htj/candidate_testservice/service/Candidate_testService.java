package htj.candidate_testservice.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.candidate_testservice.model.Candidate;
import htj.candidate_testservice.model.Candidate_test;
import htj.candidate_testservice.model.Test;
import htj.candidate_testservice.repository.Candidate_testRepository;


@Service
public class Candidate_testService {
	
	@Autowired
	private Candidate_testRepository candidate_testRep;
	
	public Candidate_testService() {
	}
	
	public Candidate_test getById(int id) {
		return candidate_testRep.findById(id);
	}
	
	public ArrayList<Candidate_test> getAll(){
		return (ArrayList<Candidate_test>) candidate_testRep.findAll();
	}
	
	public ArrayList<Candidate_test> getAllByTestId(int testId){
		return candidate_testRep.findAllByTestId(testId);
	}
	
	public ArrayList<Candidate_test> getAllByCandidateId(int candidateId){
		return candidate_testRep.findAllByCandidateId(candidateId);
	}
	
	/*public ArrayList<Candidate_test> getAllByCandidateIdAndCompletionDateIsNul(int candidateId){
		return candidate_testRep.findAllByCandidateIdAndCompletionDateIsNull(candidateId);
	}*/
	
	public Candidate_test add(Candidate_test candidate_test) {
		return candidate_testRep.save(candidate_test);
	}
	
	public Candidate_test update(Candidate_test candidate_test) {
		return candidate_testRep.save(candidate_test);
	}
	
	public void delete(Candidate_test candidate_test) {
		candidate_testRep.delete(candidate_test);
	}

}
