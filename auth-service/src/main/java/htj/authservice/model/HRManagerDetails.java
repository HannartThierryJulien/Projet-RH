package htj.authservice.model;

import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class HRManagerDetails implements UserDetails {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -423240006771169143L;
	private HRManager hrManager;
	
	public HRManagerDetails(HRManager hrManager) {
		this.hrManager = hrManager;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    return Collections.singletonList(new SimpleGrantedAuthority("hrManager"));
	}

	@Override
	public String getPassword() {
		return this.hrManager.getPassword();
	}

	@Override
	public String getUsername() {
		return this.hrManager.getMail();
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
		return this.hrManager.isArchived();
	}

}
