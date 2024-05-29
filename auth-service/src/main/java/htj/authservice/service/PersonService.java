package htj.authservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import htj.authservice.model.Person;
import htj.authservice.repository.PersonRepository;

@Service
public class PersonService {

	@Autowired
	private PersonRepository personRep;

	public PersonService() {
	}
	
	public Person getById(int id) {
		return personRep.findById(id);
	}

	public Person addPerson(Person person) {
		Person pers = personRep.save(person);
		return pers;
	}
	
	public Person updatePerson(Person person) {
		Person pers = personRep.save(person);
		return pers;
	}

}