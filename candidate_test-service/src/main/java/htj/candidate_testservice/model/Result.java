package htj.candidate_testservice.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "result")
public class Result implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_result")
	int id;

	@Column(name = "answer_selected_result")
	boolean answerSelected;

	@ManyToOne
	@JoinColumn(name = "fk_candidate_test", referencedColumnName = "id_candidate_test")
	private Candidate_test candidateTest;
	
	@ManyToOne
	@JoinColumn(name = "fk_question", referencedColumnName = "id_question")
	private Question question;
	
	@ManyToOne
	@JoinColumn(name = "fk_answer", referencedColumnName = "id_answer")
	private Answer answer;

	public Result() {
	}

	public Result(int id, boolean answerSelected, Candidate_test candidate_test, Question question, Answer answer) {
		super();
		this.id = id;
		this.answerSelected = answerSelected;
		this.candidateTest = candidate_test;
		this.question = question;
		this.answer = answer;
	}

	public Result(boolean answerSelected, Candidate_test candidate_test, Question question, Answer answer) {
		super();
		this.answerSelected = answerSelected;
		this.candidateTest = candidate_test;
		this.question = question;
		this.answer = answer;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public boolean isAnswerSelected() {
		return answerSelected;
	}

	public void setAnswerSelected(boolean answerSelected) {
		this.answerSelected = answerSelected;
	}

	public Candidate_test getCandidateTest() {
		return candidateTest;
	}

	public void setCandidate_test(Candidate_test candidateTest) {
		this.candidateTest = candidateTest;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public Answer getAnswer() {
		return answer;
	}

	public void setAnswer(Answer answer) {
		this.answer = answer;
	}
	
}
