package htj.resultservice.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.resultservice.model.Answer;
import htj.resultservice.model.Candidate_test;
import htj.resultservice.model.Question;
import htj.resultservice.model.Result;

public interface ResultRepository extends JpaRepository<Result, Integer> {

	public Result findById(int id);

	public ArrayList<Result> findAllByAnswer(Answer answer);

	public ArrayList<Result> findAllByQuestion(Question question);

	public ArrayList<Result> findAllByCandidateTestId(int candidate_testId);

	public ArrayList<Result> findAllByCandidateTestAndQuestion(Candidate_test candidateTest, Question question);

}