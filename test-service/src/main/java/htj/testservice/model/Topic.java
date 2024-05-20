package htj.testservice.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;


import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "topic")
public class Topic implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_topic")
	int id;

	@Column(name = "label_topic", nullable = false, length = 500)
	String label;

	
	@Column(name = "created_at_topic")
	LocalDateTime createdAt;

	@Column(name = "description_topic", length = 3000)
	String description;

	@Column(name = "archived_topic", nullable = false)
	boolean archived;

	@OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
	private List<Question> questionfk1;

	@OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
	private List<Questionnaire> questionnairefk1;

	public Topic() {
		super();
	}

	public Topic(String label, LocalDateTime createdAt, String description, boolean archived) {
		super();
		this.label = label;
		this.createdAt = createdAt;
		this.description = description;
		this.archived = archived;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
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
