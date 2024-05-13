package htj.authservice.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import htj.authservice.model.Candidate;
import htj.authservice.model.HRManager;
import htj.authservice.repository.HRManagerRepository;

@Service
public class HRManagerService {

	@Autowired
	private HRManagerRepository hrManagerRep;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	
	public HRManagerService() {
	}
	
	public Optional<HRManager> getByMail(String mail) {
		return hrManagerRep.findByMail(mail);
	}
	
	public HRManager getById(int id) {
		return hrManagerRep.findById(id);
	}
	
	public ArrayList<HRManager> getAllHRManagers() {
		return (ArrayList<HRManager>) hrManagerRep.findAll();
	}
	
	public ArrayList<HRManager> getAllHRManagersByArchived(boolean archived) {
		return (ArrayList<HRManager>) hrManagerRep.findAllByArchived(archived);
	}
	
	public HRManager addHRManager(HRManager hrManager) {
		hrManager.setPassword(passwordEncoder.encode(hrManager.getPassword()));
		
		HRManager hr = hrManagerRep.save(hrManager);
		return hr;
	}
	
}
