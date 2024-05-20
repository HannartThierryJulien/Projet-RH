package htj.resultservice.service;

import java.util.ArrayList;
import java.util.List;

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

	public List<Result> getAll() {
		return resultRep.findAll();
	}

	public List<Result> getAllByQuestion(Question question) {
		return resultRep.findAllByQuestion(question);
	}

	public List<Result> getAllByAnswer(Answer answer) {
		return resultRep.findAllByAnswer(answer);
	}

	public List<Result> getAllByCandidate_testAndQuestion(Candidate_test candidateTest, Question question) {
		return resultRep.findAllByCandidateTestAndQuestion(candidateTest, question);
	}

	public List<Result> getAllByCandidate_testId(int candidateTestId) {
		return resultRep.findAllByCandidateTestId(candidateTestId);
	}
	
	public List<Result> getAllByTestId(int testId) {
        return resultRep.findAllByTestId(testId);
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
