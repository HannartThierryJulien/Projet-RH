package htj.authservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.authservice.model.Person;


public interface PersonRepository extends JpaRepository<Person, Integer> {

	public Person findById(int id);

}
