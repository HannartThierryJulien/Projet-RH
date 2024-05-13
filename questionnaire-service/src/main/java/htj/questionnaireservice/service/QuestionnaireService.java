package htj.questionnaireservice.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.questionnaireservice.model.Questionnaire;
import htj.questionnaireservice.repository.QuestionnaireRepository;


@Service
public class QuestionnaireService {
	
	@Autowired
	private QuestionnaireRepository questionnaireRep;
	
	public QuestionnaireService() {
	}
	
	public Questionnaire getById(int id) {
		return questionnaireRep.findById(id);
	}
	
	public Questionnaire getByLabel(String label) {
		return questionnaireRep.findByLabel(label);
	}
	
	public ArrayList<Questionnaire> getAllByArchived(boolean value){
		return (ArrayList<Questionnaire>) questionnaireRep.findAllByArchived(value);
	}
	
	public ArrayList<Questionnaire> getAll(){
		return (ArrayList<Questionnaire>) questionnaireRep.findAll();
	}
	
	public Questionnaire add(Questionnaire questionnaire) {
		return questionnaireRep.save(questionnaire);
	}
	
	public Questionnaire update(Questionnaire questionnaire) {
		return questionnaireRep.save(questionnaire);
	}
	
	public void delete(Questionnaire questionnaire) {
		questionnaireRep.delete(questionnaire);
	}

}
