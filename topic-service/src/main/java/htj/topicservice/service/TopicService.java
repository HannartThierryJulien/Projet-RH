package htj.topicservice.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.topicservice.model.Topic;
import htj.topicservice.repository.TopicRepository;


@Service
public class TopicService {
	
	@Autowired
	private TopicRepository topicRep;
	
	public TopicService() {
	}
	
	public Topic getById(int id) {
		return topicRep.findById(id);
	}
	
	public ArrayList<Topic> getAll(){
		return (ArrayList<Topic>) topicRep.findAll();
	}
	
	public ArrayList<Topic> getAllByArchived(boolean value){
		return (ArrayList<Topic>) topicRep.findAllByArchived(value);
	}
	
	public Topic add(Topic topic) {
		return topicRep.save(topic);
	}
	
	public Topic update(Topic topic) {
		return topicRep.save(topic);
	}
	
	public void delete(Topic topic) {
		topicRep.delete(topic);
	}

}
