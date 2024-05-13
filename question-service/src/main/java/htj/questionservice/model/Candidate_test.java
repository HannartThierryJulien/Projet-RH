package htj.questionservice.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

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
@Table(name = "candidate_test")
public class Candidate_test implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_candidate_test")
	int id;

	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	@Column(name = "assignation_date_candidate_test")
	LocalDate assignationDate;

	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	@Column(name = "completion_date_candidate_test")
	LocalDate completionDate;

	@Column(name = "completion_time_candidate_test")
	LocalTime completionTime;

	@Column(name = "obtained_points_candidate_test")
	double obtainedPoints;

	@ManyToOne
	@JoinColumn(name = "fk_candidate", referencedColumnName = "id_candidate")
	private Candidate candidate;

	@ManyToOne
	@JoinColumn(name = "fk_test", referencedColumnName = "id_test")
	private Test test;

	public Candidate_test() {
	}

	public Candidate_test(LocalDate assignationDate, Candidate candidate, Test test) {
		super();
		this.assignationDate = assignationDate;
		this.candidate = candidate;
		this.test = test;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public LocalDate getAssignationDate() {
		return assignationDate;
	}

	public void setAssignationDate(LocalDate assignationDate) {
		this.assignationDate = assignationDate;
	}

	public LocalDate getCompletionDate() {
		return completionDate;
	}

	public void setCompletionDate(LocalDate completionDate) {
		this.completionDate = completionDate;
	}

	public LocalTime getCompletionTime() {
		return completionTime;
	}

	public void setCompletionTime(LocalTime completionTime) {
		this.completionTime = completionTime;
	}

	public double getObtainedPoints() {
		return obtainedPoints;
	}

	public void setObtainedPoints(double obtainedPoints) {
		this.obtainedPoints = obtainedPoints;
	}

	public Candidate getCandidate() {
		return candidate;
	}

	public void setCandidate(Candidate candidate) {
		this.candidate = candidate;
	}

	public Test getTest() {
		return test;
	}

	public void setTest(Test test) {
		this.test = test;
	}

}
