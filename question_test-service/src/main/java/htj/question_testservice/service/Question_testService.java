package htj.question_testservice.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.question_testservice.model.Question;
import htj.question_testservice.model.Question_test;
import htj.question_testservice.model.Test;
import htj.question_testservice.repository.Question_testRepository;


@Service
public class Question_testService {
	
	@Autowired
	private Question_testRepository question_testRep;
	
	@Autowired
	private TestService testServ;
	
	public Question_testService() {
	}
	
	public Question_test getById(int id) {
		return question_testRep.findById(id);
	}
	
	public Question_test getByQuestionIdAndTestId(int questionId, int testId) {
		return question_testRep.findByQuestionIdAndTestId(questionId, testId);
	}
	
	public ArrayList<Question_test> getAllByTestId(int testId){
		return (ArrayList<Question_test>) question_testRep.findAllByTestId(testId);
	}
	
	/*
	 * Supprimer cette méthode et la remplacer par un appel au test_service pour update les deux attributs
	 */
	public Question_test add(Question_test question_test) {
		Test test = testServ.getById(question_test.getTest().getId());
		test.addTimeToTimeLimit(question_test.getQuestion().getTimeLimit());
		test.setPointsSum(test.getPointsSum()+(question_test.getQuestion().getPoints()*question_test.getQuestion().getWeight()));
		testServ.update(test);
		
		return question_testRep.save(question_test);
	}
	
	public Question_test update(Question_test question_test) {
		return question_testRep.save(question_test);
	}
	
	public void delete(Question_test question_test) {
		Test test = testServ.getById(question_test.getTest().getId());
		test.subtractTimeFromTimeLimit(question_test.getQuestion().getTimeLimit());
		test.setPointsSum(test.getPointsSum()-(question_test.getQuestion().getPoints()*question_test.getQuestion().getWeight()));
		testServ.update(test);
		
		question_testRep.delete(question_test);
	}

}
