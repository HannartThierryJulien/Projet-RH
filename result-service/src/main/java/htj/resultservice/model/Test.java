package htj.resultservice.model;

import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.time.LocalDateTime;


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

@Entity
@Table(name = "test")
public class Test implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_test")
	int id;
	
	@Column(name = "label_test", nullable = false, length = 500)
	String label;

	
	@Column(name = "created_at_test")
	LocalDateTime createdAt;
	
	@Column(name = "archived_test", nullable = false)
	boolean archived;

	@OneToMany(mappedBy = "test")
	private List<Question_test> question_testfk1;
	
	@OneToMany(mappedBy = "test")
	private List<Candidate_test> candidate_testfk1;

	public Test() {
	}

	public Test(String label, LocalDateTime createdAt, boolean archived) {
		super();
		this.label = label;
		this.createdAt = createdAt;
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
	
	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	/*public void addTimeToTimeLimit(LocalTime additionalTime) {

		Duration timeSum = Duration.between(LocalTime.MIN, additionalTime)
				.plus(Duration.between(LocalTime.MIN, this.maxDurationInSeconds));
		this.maxDurationInSeconds = LocalTime.MIN.plus(timeSum);
	}

	public void subtractTimeFromTimeLimit(LocalTime subtractionTime) {
		Duration timeDifference = Duration.between(LocalTime.MIN, this.maxDurationInSeconds)
				.minus(Duration.between(LocalTime.MIN, subtractionTime));
		this.maxDurationInSeconds = LocalTime.MIN.plus(timeDifference);
	}*/

}
