package htj.answerservice.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.answerservice.model.Answer;
import htj.answerservice.model.Question;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {
	
	public Answer findById(int id);
	
	// Sera pe remplacée par findAllByQuestionId
	public ArrayList<Answer> findAllByQuestion(Question question);
	
	public ArrayList<Answer> findAllByQuestionId(int questionId);

}