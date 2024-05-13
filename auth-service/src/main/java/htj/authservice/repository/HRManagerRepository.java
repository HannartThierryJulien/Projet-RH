package htj.authservice.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import htj.authservice.model.HRManager;

public interface HRManagerRepository extends JpaRepository<HRManager, Integer> {
	
	public HRManager findById(int id);
	
	public Optional<HRManager> findByMail(String mail);
	
	public List<HRManager> findAllByArchived(boolean archived);

}