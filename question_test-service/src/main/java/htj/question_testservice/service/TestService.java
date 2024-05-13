package htj.question_testservice.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.question_testservice.model.Test;
import htj.question_testservice.repository.TestRepository;

@Service
public class TestService {
	
	@Autowired
	private TestRepository testRep;
	
	public TestService() {
	}
	
	public Test getById(int id) {
		return testRep.findById(id);
	}
	
	public ArrayList<Test> getAll(){
		return (ArrayList<Test>) testRep.findAll();
	}
	
	public Test add(Test test) {
		return testRep.save(test);
	}
	
	public Test update(Test test) {
		return testRep.save(test);
	}
	
	public void delete(Test test) {
		testRep.delete(test);
	}

}
