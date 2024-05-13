package htj.question_testservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.question_testservice.model.Test;


public interface TestRepository extends JpaRepository<Test, Integer> {
	
	public Test findById(int id);
	
}