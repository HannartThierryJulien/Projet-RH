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
@Table(name = "question_test")
public class Question_test implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_question_test")
	int id;
	
	@ManyToOne
	@JoinColumn(name = "fk_question", referencedColumnName = "id_question")
	Question question;

	@ManyToOne
	@JoinColumn(name = "fk_test", referencedColumnName = "id_test")
	Test test;

	
	public Question_test() {
	}

	public Question_test(Question question, Test test) {
		super();
		this.question = question;
		this.test = test;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public Test getTest() {
		return test;
	}

	public void setTest(Test test) {
		this.test = test;
	}
	
}
