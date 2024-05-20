package htj.answerservice.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "questionnaire")
public class Questionnaire implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_questionnaire")
	int id;

	@Column(name = "label_questionnaire", nullable = false, length = 500)
	String label;

	
	@Column(name = "created_at_questionnaire")
	LocalDateTime createdAt;
	
	@Column(name = "description_questionnaire", length = 3000)
	String description;

	@Column(name = "archived_questionnaire", nullable = false)
	boolean archived;

	@ManyToOne
	@JoinColumn(name = "fk_topic", referencedColumnName = "id_topic")
	private Topic topic;

	public Questionnaire() {
	}

	public Questionnaire(String label, LocalDateTime createdAt, String description, boolean archived, Topic topic) {
		super();
		this.label = label;
		this.createdAt = createdAt;
		this.description = description;
		this.archived = archived;
		this.topic = topic;
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

	public Topic getTopic() {
		return topic;
	}

	public void setTopic(Topic topic) {
		this.topic = topic;
	}
	
}
