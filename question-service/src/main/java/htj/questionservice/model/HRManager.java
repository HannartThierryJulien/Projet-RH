package htj.questionservice.model;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 *
 * @author Hannart Thierry-Julien
 */
@Entity
@Table(name = "hrManager", uniqueConstraints = @UniqueConstraint(columnNames = "mail_hrManager"))
public class HRManager implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_hrManager")
	int id;

	@Column(name = "mail_hrManager", nullable = false, length = 50, unique = true)
	String mail;

	@Column(name = "password_hrManager", nullable = false, length = 3000)
	String password;

	@Column(name = "archived_hrManager", nullable = false)
	boolean archived;

	@Column(name = "created_at_hrManager")
	OffsetDateTime createdAt;

	@Column(name = "updated_at_hrManager")
	OffsetDateTime updatedAt;

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

	@PrePersist
	protected void onCreate() {
		createdAt = OffsetDateTime.now(ZoneOffset.UTC);
    	updatedAt = OffsetDateTime.now(ZoneOffset.UTC);
	}

	@PreUpdate
	protected void onUpdate() {
    	updatedAt = OffsetDateTime.now(ZoneOffset.UTC);
	}

}
