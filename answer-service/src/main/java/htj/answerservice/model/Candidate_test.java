package htj.answerservice.model;

import java.io.Serializable;
import java.time.OffsetDateTime;

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

	@Column(name = "assigned_at_candidate_test")
	OffsetDateTime assignedAt;
	
	@Column(name = "started_at_candidate_test")
	OffsetDateTime startedAt;

	@Column(name = "ended_at_candidate_test")
	OffsetDateTime endedAt;

	@Column(name = "results_shared_candidate_test", nullable = false)
	boolean resultsShared;

	@Column(name = "score_candidate_test")
	double score;

	@Column(name = "status_candidate_test", nullable = true, length = 50)
	String status;

	@ManyToOne
	@JoinColumn(name = "fk_candidate", referencedColumnName = "id_candidate")
	private Candidate candidate;

	@ManyToOne
	@JoinColumn(name = "fk_test", referencedColumnName = "id_test")
	private Test test;

	public Candidate_test() {
	}


	public Candidate_test(OffsetDateTime assignedAt, OffsetDateTime startedAt, OffsetDateTime endedAt,
			boolean resultsShared, double score, String status, Candidate candidate, Test test) {
		super();
		this.assignedAt = assignedAt;
		this.startedAt = startedAt;
		this.endedAt = endedAt;
		this.resultsShared = resultsShared;
		this.score = score;
		this.status = status;
		this.candidate = candidate;
		this.test = test;
	}


	public int getId() {
		return id;
	}



	public void setId(int id) {
		this.id = id;
	}



	public OffsetDateTime getAssignedAt() {
		return assignedAt;
	}



	public void setAssignedAt(OffsetDateTime assignedAt) {
		this.assignedAt = assignedAt;
	}



	public OffsetDateTime getStartedAt() {
		return startedAt;
	}



	public void setStartedAt(OffsetDateTime startedAt) {
		this.startedAt = startedAt;
	}



	public OffsetDateTime getEndedAt() {
		return endedAt;
	}



	public void setEndedAt(OffsetDateTime endedAt) {
		this.endedAt = endedAt;
	}



	public boolean isResultsShared() {
		return resultsShared;
	}



	public void setResultsShared(boolean resultsShared) {
		this.resultsShared = resultsShared;
	}



	public double getScore() {
		return score;
	}



	public void setScore(double score) {
		this.score = score;
	}


	
	public String getStatus() {
		return status;
	}



	public void setStatus(String status) {
		this.status = status;
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
