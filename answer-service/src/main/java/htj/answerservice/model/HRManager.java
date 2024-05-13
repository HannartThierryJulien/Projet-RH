package htj.answerservice.model;

import java.io.Serializable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 *
 * @author Hannart Thierry-Julien
 */
@Entity
@Table(name = "hrManager")
public class HRManager implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_hrManager")
	int id;

	@Column(name = "mail_hrManager", nullable = false, length = 50)
	String mail;

	@Column(name = "password_hrManager", nullable = false, length = 3000)
	String password;

	@Column(name = "archived_hrManager", nullable = false)
	boolean archived;

	@ManyToOne
	@JoinColumn(name = "fk_person", referencedColumnName = "id_person")
	private Person person;

	public HRManager() {
	}

	public HRManager(String mail, String password, boolean archived, Person person) {
		super();
		this.mail = mail;
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
