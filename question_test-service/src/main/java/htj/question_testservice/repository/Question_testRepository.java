package htj.question_testservice.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.question_testservice.model.Question;
import htj.question_testservice.model.Question_test;
import htj.question_testservice.model.Test;

public interface Question_testRepository extends JpaRepository<Question_test, Integer> {
	
	public Question_test findById(int id);
	
	public Question_test findByQuestionIdAndTestId(int questionId, int testId);
	
	//public ArrayList<Question_test> findAllByTest(Test test);
	
	public ArrayList<Question_test> findAllByTestId(int testId);

}