package htj.authservice.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CandidateDetails implements UserDetails {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 828638661430364778L;
	private Candidate candidate;
	
	public CandidateDetails(Candidate candidate) {
		this.candidate = candidate;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    return Collections.singletonList(new SimpleGrantedAuthority("candidate"));
	}

	@Override
	public String getPassword() {
		return this.candidate.getPassword();
	}

	@Override
	public String getUsername() {
		return this.candidate.getMail();
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		return this.candidate.isArchived();
	}

}

