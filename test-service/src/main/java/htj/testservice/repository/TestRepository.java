package htj.testservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.testservice.model.Test;

public interface TestRepository extends JpaRepository<Test, Integer> {
	
	public Test findById(int id);
	
	public List<Test> findAllByArchived(boolean archived);
	
}