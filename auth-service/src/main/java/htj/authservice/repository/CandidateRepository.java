package htj.authservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import htj.authservice.model.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Integer> {
	
	public Candidate findById(int id);
	
	public Optional<Candidate> findByMail(String mail);
	
	public List<Candidate> findAllByArchived(boolean archived);

}