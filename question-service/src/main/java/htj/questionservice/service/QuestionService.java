package htj.questionservice.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.questionservice.model.Question;
import htj.questionservice.model.Questionnaire;
import htj.questionservice.repository.QuestionRepository;

@Service
public class QuestionService {

	@Autowired
	private QuestionRepository questionRep;
	
	public QuestionService() {
	}
	
	public Question addQuestion(Question question) {
		Question qu = questionRep.save(question);
		return qu;
	}
	
	public Question updateQuestion(Question question) {
		Question qu = questionRep.save(question);
		return qu;
	}
	
	public Question getQuestionById(int id) {
		Question qu = questionRep.findById(id);
		return qu;
	}
	
	public void deleteQuestion(Question question) {
		questionRep.delete(question);
	}
	
	public ArrayList<Question> getAllByArchived(boolean value) {
		return questionRep.findAllByArchived(value);
	}
	
	/*public ArrayList<Question> getAllByQuestionnaireId(int questionnaireId) {
		return questionRep.findAllByQuestionnaireId(questionnaireId);
	}*/
	
	public ArrayList<Question> getAllArchivedAndQuestionnaireId(boolean archived, int questionnaireId) {
		return questionRep.findAllByArchivedAndQuestionnaireId(archived, questionnaireId);
	}
	
	public ArrayList<Question> getAllQuestions() {
		return (ArrayList<Question>) questionRep.findAll();
	}
	
	
	/*public ArrayList<Question> getAllThatCanBeCopied(int questionnaireId, boolean value) {
		return questionRep.findAllByQuestionnaireIdNotAndArchived(questionnaireId, value);
	}*/

}
