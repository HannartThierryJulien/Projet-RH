package htj.testservice.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.testservice.model.Test;
import htj.testservice.repository.TestRepository;

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
	
	public ArrayList<Test> getAllByArchived(boolean archived){
		return (ArrayList<Test>) testRep.findAllByArchived(archived);
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
