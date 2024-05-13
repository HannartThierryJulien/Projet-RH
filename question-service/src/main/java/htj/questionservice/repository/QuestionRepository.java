package htj.questionservice.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.questionservice.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
	
	public Question findById(int id);
	
	public ArrayList<Question> findAllByArchived(boolean value);
	
	//ArrayList<Question> findAllByQuestionnaire(Questionnaire questionnaire);
	//public ArrayList<Question> findAllByQuestionnaireId(int questionnaireId)
	public ArrayList<Question> findAllByArchivedAndQuestionnaireId(boolean archived, int questionnaireId);;
	
	//ArrayList<Question> findAllByQuestionnaireIdNotAndArchived(int questionnaireId, boolean value);

}