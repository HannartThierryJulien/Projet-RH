package htj.topicservice.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 *
 * @author Hannart Thierry-Julien
 */
@Entity
@Table(name = "candidate")
public class Candidate implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_candidate")
	int id;

	@Column(name = "mail_candidate", nullable = false, length = 50)
	String mail;
	
	@Column(name = "professionalProfileUrl_candidate", nullable = true, length = 100)
	String professionalProfileUrl;
	
	@Column(name = "phoneNumber_candidate", nullable = true, length = 15)
	String phoneNumber;
	
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	@Column(name = "birth_date_candidate", nullable = true)
	LocalDate birthDate;

	@Column(name = "password_candidate", nullable = false, length = 3000)
	String password;

	@Column(name = "archived_candidate", nullable = false)
	boolean archived;

	@ManyToOne
	@JoinColumn(name = "fk_person", referencedColumnName = "id_person")
	private Person person;
	
	@OneToMany(mappedBy = "candidate")
	private List<Candidate_test> candidate_testfk2;

	public Candidate() {
	}

	public Candidate(String mail, String professionalProfileUrl, String phoneNumber, LocalDate birthDate, String password, boolean archived, Person person) {
		super();
		this.mail = mail;
		this.professionalProfileUrl = professionalProfileUrl;
		this.phoneNumber = phoneNumber;
		this.birthDate = birthDate;
		this.password = password;
		this.archived = archived;
		this.person = person;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}
	
	public String getProfessionalProfileUrl() {
		return professionalProfileUrl;
	}

	public void setProfessionalProfileUrl(String professionalProfileUrl) {
		this.professionalProfileUrl = professionalProfileUrl;
	}
	
	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	
	public LocalDate getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(LocalDate birthDate) {
		this.birthDate = birthDate;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	public Person getPerson() {
		return person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

}
