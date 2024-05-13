package htj.topicservice.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.topicservice.model.Topic;


public interface TopicRepository extends JpaRepository<Topic, Integer>{
	
	public Topic findById(int id);
	
	public ArrayList<Topic> findAllByArchived(boolean value);

}
