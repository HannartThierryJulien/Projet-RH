package htj.answerservice.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.answerservice.model.Answer;
import htj.answerservice.model.Question;
import htj.answerservice.repository.AnswerRepository;

@Service
public class AnswerService {

	@Autowired
	private AnswerRepository answerRep;

	public AnswerService() {
	}

	public Answer addAnswer(Answer answer) {
		Answer answer1 = answerRep.save(answer);
		return answer1;
	}
	
	public Answer updateAnswer(Answer answer) {
		Answer answer1 = answerRep.save(answer);
		return answer1;
	}

	public List<Answer> addAnswers(List<Answer> listofAnswers) {
	    List<Answer> addedAnswers = new ArrayList<>();
	    for (Answer answer : listofAnswers) {
	        addedAnswers.add(answerRep.save(answer));
	    }
	    return addedAnswers;
	}
	
	// Sera pe remplacée par getAllAnswersByQuestionId
	public List<Answer> getAllAnswersByQuestion(Question question) {
	    return answerRep.findAllByQuestion(question);
	}
	
	public List<Answer> getAllAnswersByQuestionId(int questionId) {
	    return answerRep.findAllByQuestionId(questionId);
	}
	
	public List<Answer> getAllAnswers() {
	    return answerRep.findAll();
	}
	
	public void deleteAnswer(Answer answer) {
		answerRep.delete(answer);
	}
	
	public Answer getAnswerById(int id) {
		return answerRep.findById(id);
	}

}
