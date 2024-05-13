package htj.questionnaireservice.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.questionnaireservice.model.Questionnaire;


public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Integer>{
	
	public Questionnaire findById(int id);
	
	public Questionnaire findByLabel(String label);
	
	public ArrayList<Questionnaire> findAllByArchived(boolean value);

}
