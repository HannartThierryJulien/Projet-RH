package htj.authservice.model;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.CascadeType;
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
@Table(name = "question")
public class Question implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_question")
	int id;

	@Column(name = "label_question", nullable = false, length = 500)
	String label;

	@Column(name = "points_question", nullable = false)
	double points;

	@Column(name = "weight_question", nullable = false)
	int weight;

	@Column(name = "max_duration_in_seconds_question", nullable = false)
	int maxDurationInSeconds;

	@Column(name = "archived_question", nullable = false)
	boolean archived;

	@OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
	private List<Answer> questionfk1;
	
	@ManyToOne
	@JoinColumn(name = "fk_topic", referencedColumnName = "id_topic")
	private Topic topic;
	
	@ManyToOne
	@JoinColumn(name = "fk_questionnaire", referencedColumnName = "id_questionnaire")
	private Questionnaire questionnaire;
	
	@OneToMany(mappedBy = "question")
	private List<Question_test> question_testfk1;

	public Question() {
	}

	public Question(String label, double points, int weight, int maxDurationInSeconds, boolean archived, Topic topic, Questionnaire questionnaire) {
		super();
		this.label = label;
		this.points = points;
		this.weight = weight;
		this.maxDurationInSeconds = maxDurationInSeconds;
		this.archived = archived;
		this.topic = topic;
		this.questionnaire = questionnaire;
	}
	
	public Question(String label, double points, int weight, int maxDurationInSeconds, boolean archived, Topic topic) {
		super();
		this.label = label;
		this.points = points;
		this.weight = weight;
		this.maxDurationInSeconds = maxDurationInSeconds;
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

	public double getPoints() {
		return points;
	}

	public void setPoints(double points) {
		this.points = points;
	}

	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	public int getMaxDurationInSeconds() {
		return maxDurationInSeconds;
	}

	public void setMaxDurationInSeconds(int maxDurationInSeconds) {
		this.maxDurationInSeconds = maxDurationInSeconds;
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

	public Questionnaire getQuestionnaire() {
		return questionnaire;
	}

	public void setQuestionnaire(Questionnaire questionnaire) {
		this.questionnaire = questionnaire;
	}

}
