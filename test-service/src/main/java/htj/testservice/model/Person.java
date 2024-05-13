package htj.testservice.model;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "person")
public class Person implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_person")
	int id;

	@Column(name = "lastName_persone", nullable = false, length = 50)
	String lastName;

	@Column(name = "firstname_person", nullable = false, length = 50)
	String firstName;

	@Column(name = "description_person", length = 3000)
	String description;

	@Column(name = "archived_person", nullable = false)
	boolean archived;

	@OneToMany(mappedBy = "person", cascade = CascadeType.ALL)
	private List<Candidate> candidatefk1;

	@OneToMany(mappedBy = "person", cascade = CascadeType.ALL)
	private List<HRManager> hrManagerfk1;

	public Person() {
		super();
	}

	public Person(String lastName, String firstName, String description, boolean archived) {
		super();
		this.lastName = lastName;
		this.firstName = firstName;
		this.description = description;
		this.archived = archived;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}

}