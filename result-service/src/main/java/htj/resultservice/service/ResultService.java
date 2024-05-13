package htj.resultservice.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.resultservice.model.Answer;
import htj.resultservice.model.Candidate_test;
import htj.resultservice.model.Question;
import htj.resultservice.model.Result;
import htj.resultservice.repository.ResultRepository;

@Service
public class ResultService {

	@Autowired
	private ResultRepository resultRep;

	public ResultService() {
	}

	public Result getById(int id) {
		return resultRep.findById(id);
	}

	public ArrayList<Result> getAll() {
		return (ArrayList<Result>) resultRep.findAll();
	}

	public ArrayList<Result> getAllByQuestion(Question question) {
		return (ArrayList<Result>) resultRep.findAllByQuestion(question);
	}

	public ArrayList<Result> getAllByAnswer(Answer answer) {
		return (ArrayList<Result>) resultRep.findAllByAnswer(answer);
	}

	public ArrayList<Result> getAllByCandidate_testAndQuestion(Candidate_test candidateTest, Question question) {
		return (ArrayList<Result>) resultRep.findAllByCandidateTestAndQuestion(candidateTest, question);
	}

	public ArrayList<Result> getAllByCandidate_testId(int candidateTestId) {
		return resultRep.findAllByCandidateTestId(candidateTestId);
	}

	public Result add(Result result) {
		return resultRep.save(result);
	}

	public Result update(Result result) {
		return resultRep.save(result);
	}

	public void delete(Result result) {
		resultRep.delete(result);
	}

}
