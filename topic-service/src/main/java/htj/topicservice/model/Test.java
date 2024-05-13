package htj.topicservice.model;

import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
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

	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	@Column(name = "creation_date_test", nullable = false)
	LocalDate creationDate;

	@Column(name = "points_sum_test", nullable = false)
	double pointsSum;

	@Column(name = "time_limit_test", nullable = false)
	LocalTime timeLimit;
	
	@Column(name = "archived_test", nullable = false)
	boolean archived;

	@OneToMany(mappedBy = "test")
	private List<Question_test> question_testfk1;
	
	@OneToMany(mappedBy = "test")
	private List<Candidate_test> candidate_testfk1;

	public Test() {
	}

	public Test(String label, LocalDate creationDate, double pointsSum, LocalTime timeLimit, boolean archived) {
		super();
		this.label = label;
		this.creationDate = creationDate;
		this.pointsSum = pointsSum;
		this.timeLimit = timeLimit;
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

	public LocalDate getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(LocalDate creationDate) {
		this.creationDate = creationDate;
	}

	public double getPointsSum() {
		return pointsSum;
	}

	public void setPointsSum(double points) {
		this.pointsSum = points;
	}

	public LocalTime getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(LocalTime timeLimit) {
		this.timeLimit = timeLimit;
	}
	
	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	public void addTimeToTimeLimit(LocalTime additionalTime) {

		Duration timeSum = Duration.between(LocalTime.MIN, additionalTime)
				.plus(Duration.between(LocalTime.MIN, this.timeLimit));
		this.timeLimit = LocalTime.MIN.plus(timeSum);
	}

	public void subtractTimeFromTimeLimit(LocalTime subtractionTime) {
		Duration timeDifference = Duration.between(LocalTime.MIN, this.timeLimit)
				.minus(Duration.between(LocalTime.MIN, subtractionTime));
		this.timeLimit = LocalTime.MIN.plus(timeDifference);
	}

}
