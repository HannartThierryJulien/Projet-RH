package htj.candidate_testservice.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.candidate_testservice.model.Candidate;
import htj.candidate_testservice.model.Candidate_test;
import htj.candidate_testservice.model.Test;

public interface Candidate_testRepository extends JpaRepository<Candidate_test, Integer> {
	
	public Candidate_test findById(int id);
	
	public Candidate_test findByCandidate(Candidate candidate);
	
	public Candidate_test findByTest(Test test);
	
	public ArrayList<Candidate_test> findAllByTestId(int testId);
	
	public ArrayList<Candidate_test> findAllByCandidateId(int candidateId);
	
	//public ArrayList<Candidate_test> findAllByCandidateIdAndCompletionDateIsNull(int candidateId);

}