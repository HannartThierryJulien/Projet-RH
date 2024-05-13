-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: projet_rh
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `id_answer` int NOT NULL AUTO_INCREMENT,
  `archived_answer` bit(1) NOT NULL,
  `label_answer` varchar(500) NOT NULL,
  `right_answer` bit(1) NOT NULL,
  `fk_question` int DEFAULT NULL,
  PRIMARY KEY (`id_answer`),
  KEY `FKkhyywg9f5qsfo3ob9m3gkddhx` (`fk_question`),
  CONSTRAINT `FKkhyywg9f5qsfo3ob9m3gkddhx` FOREIGN KEY (`fk_question`) REFERENCES `question` (`id_question`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES (1,_binary '\0','Tangente',_binary '\0',1),(2,_binary '\0','Cosinus',_binary '',1),(3,_binary '\0','Sécanse',_binary '\0',1),(4,_binary '\0','π',_binary '',2),(5,_binary '\0','2π',_binary '\0',2),(6,_binary '\0','1/2π',_binary '\0',2),(7,_binary '\0','Sin²θ + Cos²θ = 1',_binary '',3),(8,_binary '\0','Cscθ = 1/Sinθ',_binary '\0',3),(9,_binary '\0','Tanθ = Sinθ/Cosθ',_binary '\0',3),(10,_binary '\0','Fromage cheddar',_binary '\0',4),(11,_binary '\0','Crème fraîche',_binary '\0',4),(12,_binary '\0','Œufs',_binary '',4),(13,_binary '\0','Champignons',_binary '\0',5),(14,_binary '\0','Tomates',_binary '',5),(15,_binary '\0','Poivrons',_binary '\0',5),(16,_binary '\0','Spaghetti',_binary '',6),(17,_binary '\0','Tagliatelle',_binary '\0',6),(18,_binary '\0','Penne',_binary '\0',6),(31,_binary '\0','ss',_binary '\0',15),(32,_binary '\0','sss',_binary '',15),(33,_binary '\0','1',_binary '',16),(34,_binary '\0','11',_binary '',16);
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate` (
  `id_candidate` int NOT NULL AUTO_INCREMENT,
  `archived_candidate` bit(1) NOT NULL,
  `mail_candidate` varchar(50) NOT NULL,
  `password_candidate` varchar(3000) NOT NULL,
  `fk_person` int DEFAULT NULL,
  PRIMARY KEY (`id_candidate`),
  KEY `FKk87qkxunki5wa1he5u8qpboo8` (`fk_person`),
  CONSTRAINT `FKk87qkxunki5wa1he5u8qpboo8` FOREIGN KEY (`fk_person`) REFERENCES `person` (`id_person`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
INSERT INTO `candidate` VALUES (1,_binary '\0','boblebrun@gmail.com','$2a$10$BUCqlAhYSmFZcQSG17NjjeGn9a5HEnuUoNYH.M55bfvsNJdUt7GBi',1),(2,_binary '\0','tjhannart@gmail.com','$2a$10$NEW3h/5olK8iAWfHZdlT/.4LDjQHc3np.gsTYFPU7qCth7WK7UP/K',2);
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_test`
--

DROP TABLE IF EXISTS `candidate_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_test` (
  `id_candidate_test` int NOT NULL AUTO_INCREMENT,
  `assignation_date_candidate_test` date DEFAULT NULL,
  `completion_date_candidate_test` date DEFAULT NULL,
  `completion_time_candidate_test` time(6) DEFAULT NULL,
  `obtained_points_candidate_test` double DEFAULT NULL,
  `fk_candidate` int DEFAULT NULL,
  `fk_test` int DEFAULT NULL,
  PRIMARY KEY (`id_candidate_test`),
  KEY `FKfv2ogsdb3gg94w1ftpd8l8jy2` (`fk_candidate`),
  KEY `FKhp5ohu1mkk7k58cdxvxmgb503` (`fk_test`),
  CONSTRAINT `FKfv2ogsdb3gg94w1ftpd8l8jy2` FOREIGN KEY (`fk_candidate`) REFERENCES `candidate` (`id_candidate`),
  CONSTRAINT `FKhp5ohu1mkk7k58cdxvxmgb503` FOREIGN KEY (`fk_test`) REFERENCES `test` (`id_test`)
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_test`
--

LOCK TABLES `candidate_test` WRITE;
/*!40000 ALTER TABLE `candidate_test` DISABLE KEYS */;
INSERT INTO `candidate_test` VALUES (140,'2024-05-11','2024-05-11','00:00:00.000000',0,2,1),(141,'2024-05-11','2024-05-11','00:00:00.000000',0,1,1),(151,'2024-05-11','2024-05-11','00:00:00.000000',0,2,9),(152,'2024-05-11',NULL,NULL,0,2,9),(153,'2024-05-11',NULL,NULL,0,2,10),(154,'2024-05-11',NULL,NULL,0,1,1);
/*!40000 ALTER TABLE `candidate_test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_manager`
--

DROP TABLE IF EXISTS `hr_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_manager` (
  `id_hr_manager` int NOT NULL AUTO_INCREMENT,
  `archived_hr_manager` bit(1) NOT NULL,
  `mail_hr_manager` varchar(50) NOT NULL,
  `password_hr_manager` varchar(3000) NOT NULL,
  `fk_person` int DEFAULT NULL,
  PRIMARY KEY (`id_hr_manager`),
  KEY `FK94bn80yyu29rdcurxi30cdec6` (`fk_person`),
  CONSTRAINT `FK94bn80yyu29rdcurxi30cdec6` FOREIGN KEY (`fk_person`) REFERENCES `person` (`id_person`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_manager`
--

LOCK TABLES `hr_manager` WRITE;
/*!40000 ALTER TABLE `hr_manager` DISABLE KEYS */;
INSERT INTO `hr_manager` VALUES (1,_binary '\0','laurentphilippe@gmail.com','$2a$10$Aby9e/40zUYFuySGMtjZA.Phe7O/1WxNdH7XjmZlPTUubn2nHLeCO',3);
/*!40000 ALTER TABLE `hr_manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `id_person` int NOT NULL AUTO_INCREMENT,
  `archived_person` bit(1) NOT NULL,
  `description_person` varchar(3000) DEFAULT NULL,
  `firstname_person` varchar(50) NOT NULL,
  `last_name_persone` varchar(50) NOT NULL,
  PRIMARY KEY (`id_person`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,_binary '\0','Candidate at Aubay','Bob','Le Brun'),(2,_binary '\0','Stagiaire chez Aubay','Thierry-Julien','Hannart'),(3,_binary '\0','Computer Software Recruiter','Philippe','Laurent');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id_question` int NOT NULL AUTO_INCREMENT,
  `archived_question` bit(1) NOT NULL,
  `label_question` varchar(500) NOT NULL,
  `points_question` double NOT NULL,
  `time_limit_question` time(6) NOT NULL,
  `weight_question` int NOT NULL,
  `fk_questionnaire` int DEFAULT NULL,
  `fk_topic` int DEFAULT NULL,
  PRIMARY KEY (`id_question`),
  KEY `FKb5a21ulxfbx2tvi68tqx8jmee` (`fk_questionnaire`),
  KEY `FK421u8e57vbn6kqyrd2sxrdn58` (`fk_topic`),
  CONSTRAINT `FK421u8e57vbn6kqyrd2sxrdn58` FOREIGN KEY (`fk_topic`) REFERENCES `topic` (`id_topic`),
  CONSTRAINT `FKb5a21ulxfbx2tvi68tqx8jmee` FOREIGN KEY (`fk_questionnaire`) REFERENCES `questionnaire` (`id_questionnaire`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,_binary '\0','Quelle est la fonction trigonométrique qui représente le rapport entre le côté opposé et l\'hypoténuse dans un triangle rectangle?',5,'00:01:01.000000',2,1,1),(2,_binary '\0','Quelle est la période de la fonction sinus?',2,'00:01:00.000000',3,1,1),(3,_binary '\0','Quelle est la relation fondamentale entre les fonctions trigonométriques sinus et cosinus dans un triangle rectangle?',100,'00:01:00.000000',3,1,1),(4,_binary '\0','Quel est l\'ingrédient principal de la sauce carbonara italienne?',2,'00:01:00.000000',3,2,2),(5,_binary '\0','Quel est l\'ingrédient de base pour faire une pizza margherita?',2,'00:01:01.000000',3,2,2),(6,_binary '\0','Quel type de pâtes est utilisé traditionnellement dans le plat italien \"spaghetti alla puttanesca\"?',222,'00:01:00.000000',3,2,2),(15,_binary '\0','test question added on the fly in a test',10,'00:00:30.000000',10,4,5),(16,_binary '\0','dd',2,'00:00:31.000000',100,1,2);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_test`
--

DROP TABLE IF EXISTS `question_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_test` (
  `id_question_test` int NOT NULL AUTO_INCREMENT,
  `fk_question` int DEFAULT NULL,
  `fk_test` int DEFAULT NULL,
  PRIMARY KEY (`id_question_test`),
  KEY `FK59xrex75ihb0lkgxt8c9oxc90` (`fk_question`),
  KEY `FKpby8vpa6tev6k599pi4rntiiq` (`fk_test`),
  CONSTRAINT `FK59xrex75ihb0lkgxt8c9oxc90` FOREIGN KEY (`fk_question`) REFERENCES `question` (`id_question`),
  CONSTRAINT `FKpby8vpa6tev6k599pi4rntiiq` FOREIGN KEY (`fk_test`) REFERENCES `test` (`id_test`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_test`
--

LOCK TABLES `question_test` WRITE;
/*!40000 ALTER TABLE `question_test` DISABLE KEYS */;
INSERT INTO `question_test` VALUES (49,1,1),(50,2,1),(51,3,1),(68,1,9),(73,3,10),(74,1,10),(75,16,10);
/*!40000 ALTER TABLE `question_test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire`
--

DROP TABLE IF EXISTS `questionnaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaire` (
  `id_questionnaire` int NOT NULL AUTO_INCREMENT,
  `archived_questionnaire` bit(1) NOT NULL,
  `creation_date_questionnaire` date NOT NULL,
  `description_questionnaire` varchar(3000) DEFAULT NULL,
  `label_questionnaire` varchar(500) NOT NULL,
  `fk_topic` int DEFAULT NULL,
  PRIMARY KEY (`id_questionnaire`),
  KEY `FK4yta7upqdme7olmsjittfxxbt` (`fk_topic`),
  CONSTRAINT `FK4yta7upqdme7olmsjittfxxbt` FOREIGN KEY (`fk_topic`) REFERENCES `topic` (`id_topic`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire`
--

LOCK TABLES `questionnaire` WRITE;
/*!40000 ALTER TABLE `questionnaire` DISABLE KEYS */;
INSERT INTO `questionnaire` VALUES (1,_binary '\0','2024-04-03','Questionnaire sur la trigo','Trigonométrie',1),(2,_binary '\0','2024-04-03','La cuisina dé la mama','Cuisine italienne',2),(4,_binary '\0','2024-05-08','','On the fly',5);
/*!40000 ALTER TABLE `questionnaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `result`
--

DROP TABLE IF EXISTS `result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `result` (
  `id_result` int NOT NULL AUTO_INCREMENT,
  `answer_selected_result` bit(1) DEFAULT NULL,
  `fk_answer` int DEFAULT NULL,
  `fk_candidate_test` int DEFAULT NULL,
  `fk_question` int DEFAULT NULL,
  PRIMARY KEY (`id_result`),
  KEY `FKeledtgkhtne6rwjawabp82ujw` (`fk_answer`),
  KEY `FKfmo4nr4xac6xnmwcvecdk0to8` (`fk_candidate_test`),
  KEY `FKlumqpjm5idkhld2alhojp5lmf` (`fk_question`),
  CONSTRAINT `FKeledtgkhtne6rwjawabp82ujw` FOREIGN KEY (`fk_answer`) REFERENCES `answer` (`id_answer`),
  CONSTRAINT `FKfmo4nr4xac6xnmwcvecdk0to8` FOREIGN KEY (`fk_candidate_test`) REFERENCES `candidate_test` (`id_candidate_test`),
  CONSTRAINT `FKlumqpjm5idkhld2alhojp5lmf` FOREIGN KEY (`fk_question`) REFERENCES `question` (`id_question`)
) ENGINE=InnoDB AUTO_INCREMENT=896 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `result`
--

LOCK TABLES `result` WRITE;
/*!40000 ALTER TABLE `result` DISABLE KEYS */;
INSERT INTO `result` VALUES (875,_binary '\0',1,140,1),(876,_binary '\0',2,140,1),(877,_binary '\0',3,140,1),(878,_binary '\0',4,140,2),(879,_binary '\0',5,140,2),(880,_binary '\0',6,140,2),(881,_binary '\0',7,140,3),(882,_binary '\0',8,140,3),(883,_binary '\0',9,140,3),(884,_binary '\0',1,141,1),(885,_binary '\0',2,141,1),(886,_binary '\0',3,141,1),(887,_binary '\0',4,141,2),(888,_binary '\0',5,141,2),(889,_binary '\0',6,141,2),(890,_binary '\0',7,141,3),(891,_binary '\0',8,141,3),(892,_binary '\0',9,141,3),(893,_binary '\0',1,151,1),(894,_binary '\0',2,151,1),(895,_binary '\0',3,151,1);
/*!40000 ALTER TABLE `result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id_test` int NOT NULL AUTO_INCREMENT,
  `archived_test` bit(1) NOT NULL,
  `creation_date_test` date NOT NULL,
  `label_test` varchar(500) NOT NULL,
  `points_sum_test` double NOT NULL,
  `time_limit_test` time(6) NOT NULL,
  PRIMARY KEY (`id_test`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (1,_binary '\0','2024-04-25','Faux test 1',316,'00:03:01.000000'),(9,_binary '\0','2024-05-11','d',10,'00:01:01.000000'),(10,_binary '\0','2024-05-11','rrr',510,'00:02:32.000000'),(11,_binary '\0','2024-05-12','fr',0,'00:00:00.000000');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic` (
  `id_topic` int NOT NULL AUTO_INCREMENT,
  `archived_topic` bit(1) NOT NULL,
  `creation_date_topic` date NOT NULL,
  `description_topic` varchar(3000) DEFAULT NULL,
  `label_topic` varchar(500) NOT NULL,
  PRIMARY KEY (`id_topic`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (1,_binary '\0','2024-04-03','thème en rapport avec les math','Mathématique'),(2,_binary '\0','2024-04-03',NULL,'Nourriture'),(4,_binary '\0','2024-04-24','rrrrrrr','rzqrrrrr'),(5,_binary '\0','2024-05-08','','On the fly');
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-12 11:25:46
