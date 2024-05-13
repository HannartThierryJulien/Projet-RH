package htj.questionservice.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "answer")
//@JsonIgnoreProperties(ignoreUnknown = true)
public class Answer implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_answer")
	int id;

	@Column(name = "label_answer", nullable = false, length = 500)
	String label;

	@Column(name = "right_answer", nullable = false)
	boolean right;

	@Column(name = "archived_answer", nullable = false)
	boolean archived;

	@ManyToOne
	@JoinColumn(name = "fk_question", referencedColumnName = "id_question")
	private Question question;

	public Answer() {
	}

	public Answer(String label, boolean right, boolean archived, Question question) {
		super();
		this.label = label;
		this.right = right;
		this.archived = archived;
		this.question = question;
	}
	
	public Answer(String label, boolean right, boolean archived) {
		super();
		this.label = label;
		this.right = right;
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

	public boolean isRight() {
		return right;
	}

	public void setRight(boolean right) {
		this.right = right;
	}

	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	@Override
	public String toString() {
		return "Answer [id=" + id + ", label=" + label + ", right=" + right + ", archived=" + archived + ", question="
				+ question + "]";
	}
	
	

}
