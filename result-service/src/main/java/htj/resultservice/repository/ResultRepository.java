package htj.resultservice.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import htj.resultservice.model.Answer;
import htj.resultservice.model.Candidate_test;
import htj.resultservice.model.Question;
import htj.resultservice.model.Result;

public interface ResultRepository extends JpaRepository<Result, Integer> {

	public Result findById(int id);

	public List<Result> findAllByAnswer(Answer answer);

	public List<Result> findAllByQuestion(Question question);

	public List<Result> findAllByCandidateTestId(int candidate_testId);

	public List<Result> findAllByCandidateTestAndQuestion(Candidate_test candidateTest, Question question);
	
	@Query("SELECT r FROM Result r WHERE r.candidateTest.test.id = :testId")
    List<Result> findAllByTestId(@Param("testId") int testId);

}