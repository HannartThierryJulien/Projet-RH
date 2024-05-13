package htj.gatewayservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;


@Service
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final Logger logger = LoggerFactory.getLogger(KafkaProducer.class);

    public KafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    /*
     * Si la ligne kafkaTemplate.send(topic, json); est remplacée par kafkaTemplate.send(topic, json).get();
     * alors le code sera suspendu afin d'attendre une confirmation que le message kafka a bel et bien été envoyé.
     * En rajoutant .get(), on passe donc d'un envoi de message asynchrone à un envoi synchrone.
     */
    public boolean sendMessage(String json, String topic) {
        try {
        	kafkaTemplate.send(topic, json);
            logger.info("Envoi du message Kafka réussi.");
            return true;
        } catch (Exception e) {
            logger.error("ERREUR : Erreur lors de l'envoi du message à Kafka : " + e.getMessage());
            return false;
        }
    }
}
