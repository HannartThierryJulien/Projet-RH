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
) ENGINE=InnoDB AUTO_INCREMENT=264 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES (1,_binary '\0','Tangente',_binary '\0',1),(2,_binary '\0','Cosinus',_binary '',1),(3,_binary '\0','Sécanse',_binary '\0',1),(4,_binary '\0','π',_binary '',2),(5,_binary '\0','2π',_binary '\0',2),(6,_binary '\0','1/2π',_binary '\0',2),(7,_binary '\0','Sin²θ + Cos²θ = 1',_binary '',3),(8,_binary '\0','Cscθ = 1/Sinθ',_binary '\0',3),(9,_binary '\0','Tanθ = Sinθ/Cosθ',_binary '\0',3),(10,_binary '\0','Fromage cheddar',_binary '\0',4),(11,_binary '\0','Crème fraîche',_binary '\0',4),(12,_binary '\0','Œufs',_binary '',4),(13,_binary '\0','Champignons',_binary '\0',5),(14,_binary '\0','Tomates',_binary '',5),(15,_binary '\0','Poivrons',_binary '\0',5),(16,_binary '\0','Spaghetti',_binary '',6),(17,_binary '\0','Tagliatelle',_binary '\0',6),(18,_binary '\0','Penne',_binary '\0',6),(31,_binary '\0','ss',_binary '\0',15),(32,_binary '\0','sss',_binary '',15),(57,_binary '\0','Une méthode de cuisson utilisant de la vapeur d\'eau.',_binary '',18),(58,_binary '\0','Une méthode de cuisson utilisant de l\'huile.',_binary '\0',18),(59,_binary '\0','Une méthode de cuisson utilisant du vin.',_binary '\0',18),(60,_binary '\0','Des légumes.',_binary '',19),(61,_binary '\0','De la viande.',_binary '\0',19),(62,_binary '\0','Des fruits de mer.',_binary '\0',19),(63,_binary '\0','7-9 minutes.',_binary '',20),(64,_binary '\0','10-12 minutes.',_binary '\0',20),(65,_binary '\0','15-20 minutes.',_binary '\0',20),(66,_binary '\0','Une poêle a une surface plate tandis qu\'une casserole a des côtés plus hauts.',_binary '',21),(67,_binary '\0','Une poêle est utilisée pour la cuisson au four tandis qu\'une casserole est utilisée pour la cuisson sur la cuisinière.',_binary '\0',21),(68,_binary '\0','Une poêle est plus grande qu\'une casserole.',_binary '\0',21),(69,_binary '\0','Le curcuma.',_binary '',22),(70,_binary '\0','La cannelle.',_binary '\0',22),(71,_binary '\0','Le cumin.',_binary '\0',22),(72,_binary '\0','La cuisson au four.',_binary '\0',23),(73,_binary '\0','La cuisson à la vapeur.',_binary '\0',23),(74,_binary '\0','La cuisson par induction.',_binary '',23),(75,_binary '\0','Le riz.',_binary '',24),(76,_binary '\0','Les pâtes.',_binary '\0',24),(77,_binary '\0','Les pommes de terre.',_binary '\0',24),(78,_binary '\0','Mont Everest',_binary '',31),(79,_binary '\0','Mont Kilimandjaro',_binary '\0',31),(80,_binary '\0','Mont McKinley',_binary '\0',31),(81,_binary '\0','Mont Fuji',_binary '\0',31),(82,_binary '\0','Paris',_binary '',25),(83,_binary '\0','Londres',_binary '\0',25),(84,_binary '\0','Berlin',_binary '\0',25),(85,_binary '\0','Rome',_binary '\0',25),(90,_binary '\0','Russie',_binary '',26),(91,_binary '\0','Canada',_binary '\0',26),(92,_binary '\0','Chine',_binary '\0',26),(93,_binary '\0','États-Unis',_binary '\0',26),(94,_binary '\0','Groenland',_binary '',27),(95,_binary '\0','Australie',_binary '\0',27),(96,_binary '\0','Madagascar',_binary '\0',27),(97,_binary '\0','Bornéo',_binary '\0',27),(98,_binary '\0','Océan Pacifique',_binary '',28),(99,_binary '\0','Océan Atlantique',_binary '\0',28),(100,_binary '\0','Océan Indien',_binary '\0',28),(101,_binary '\0','Océan Arctique',_binary '\0',28),(102,_binary '\0','Le Nil',_binary '',29),(103,_binary '\0','L\'Amazone',_binary '\0',29),(104,_binary '\0','Le Mississippi',_binary '\0',29),(105,_binary '\0','Le Yangzi Jiang',_binary '\0',29),(106,_binary '\0','Russie',_binary '',30),(107,_binary '\0','Chine',_binary '\0',30),(108,_binary '\0','Inde',_binary '\0',30),(109,_binary '\0','Turquie',_binary '\0',30),(110,_binary '\0','Refroidir la brûlure avec de l\'eau froide',_binary '',32),(111,_binary '\0','Appliquer du beurre sur la brûlure',_binary '\0',32),(112,_binary '\0','Frotter la brûlure avec un tissu',_binary '\0',32),(113,_binary '\0','Appliquer de la crème antiseptique',_binary '\0',32),(114,_binary '\0','Donner des tapes dans le dos',_binary '\0',33),(115,_binary '\0','Effectuer la manoeuvre de Heimlich',_binary '',33),(116,_binary '\0','Faire boire de l\'eau à la personne',_binary '\0',33),(117,_binary '\0','Frapper fort sur le thorax de la personne',_binary '\0',33),(118,_binary '\0','Appeler les secours',_binary '',34),(119,_binary '\0','Mettre la personne en position latérale de sécurité',_binary '\0',34),(120,_binary '\0','Masser le ventre de la personne',_binary '\0',34),(121,_binary '\0','Donner de l\'eau à la personne',_binary '\0',34),(122,_binary '\0','La personne ne respire plus',_binary '',35),(123,_binary '\0','La personne respire normalement',_binary '\0',35),(124,_binary '\0','La personne tousse',_binary '\0',35),(125,_binary '\0','La personne est fatiguée',_binary '\0',35),(126,_binary '\0','Exercer une pression sur la plaie',_binary '',36),(127,_binary '\0','Laisser la plaie à l\'air libre',_binary '\0',36),(128,_binary '\0','Appliquer une compresse chaude',_binary '\0',36),(129,_binary '\0','Ignorer le saignement',_binary '\0',36),(130,_binary '\0','La personne ressent une douleur au niveau de la zone blessée',_binary '',37),(131,_binary '\0','La personne respire plus rapidement que d\'habitude',_binary '\0',37),(132,_binary '\0','La personne présente des signes de fatigue',_binary '\0',37),(133,_binary '\0','La personne présente des rougeurs au niveau de la zone blessée',_binary '\0',37),(134,_binary '\0','Allonger la personne et surélever ses jambes',_binary '\0',38),(135,_binary '\0','Donner un verre d\'eau à la personne',_binary '\0',38),(136,_binary '\0','Laisser la personne seule',_binary '\0',38),(137,_binary '\0','Desserrer les vêtements de la personne et la rafraîchir',_binary '',38),(138,_binary '\0','Le protocole TCP/IP est un protocole de communication utilisé pour connecter des dispositifs sur un réseau informatique.',_binary '',39),(139,_binary '\0','Le protocole TCP/IP est un logiciel de sécurité utilisé pour protéger les données sur Internet.',_binary '\0',39),(140,_binary '\0','Le protocole TCP/IP est un logiciel de compression de données utilisé pour accélérer la vitesse de transmission sur Internet.',_binary '\0',39),(141,_binary '\0','Le DNS (Domain Name System) est un système permettant de traduire les noms de domaine en adresses IP.',_binary '',40),(142,_binary '\0','Le DNS est un protocole de transfert de fichiers sur Internet.',_binary '\0',40),(143,_binary '\0','Le DNS est un service de messagerie électronique.',_binary '\0',40),(144,_binary '\0','Le Wi-Fi est une technologie de communication sans fil utilisée pour connecter des appareils à un réseau local.',_binary '',41),(145,_binary '\0','Le Wi-Fi est un type de câble réseau utilisé pour relier les ordinateurs à Internet.',_binary '\0',41),(146,_binary '\0','Le Wi-Fi est un protocole de sécurité utilisé pour protéger les réseaux informatiques.',_binary '\0',41),(147,_binary '\0','Le Bluetooth est une technologie de communication sans fil utilisée pour échanger des données sur de courtes distances.',_binary '',42),(148,_binary '\0','Le Bluetooth est un type de connecteur réseau utilisé pour les connexions filaires.',_binary '\0',42),(149,_binary '\0','Le Bluetooth est un logiciel de sécurité pour les réseaux sans fil.',_binary '\0',42),(150,_binary '\0','Un routeur permet de diriger le trafic réseau entre différents réseaux.',_binary '',43),(151,_binary '\0','Un commutateur permet de connecter plusieurs périphériques sur un même réseau.',_binary '\0',43),(152,_binary '\0','Un routeur est utilisé pour connecter des périphériques Bluetooth.',_binary '\0',43),(153,_binary '\0','Un pare-feu est un dispositif de sécurité réseau qui contrôle et filtre le trafic entrant et sortant.',_binary '',44),(154,_binary '\0','Un pare-feu est un logiciel utilisé pour accélérer la vitesse de connexion Internet.',_binary '\0',44),(155,_binary '\0','Un pare-feu est un dispositif de stockage réseau utilisé pour sauvegarder des données.',_binary '\0',44),(156,_binary '\0','Un modem est un dispositif utilisé pour établir une connexion Internet.',_binary '',45),(157,_binary '\0','Un routeur est un dispositif utilisé pour connecter plusieurs périphériques sur un même réseau local.',_binary '\0',45),(158,_binary '\0','Un modem est un dispositif utilisé pour convertir les signaux numériques en signaux analogiques.',_binary '\0',45),(159,_binary '\0','Un pare-feu est un dispositif de sécurité qui surveille et contrôle le trafic réseau entrant et sortant, bloquant ou autorisant le trafic en fonction de règles de sécurité établies. Son rôle est de protéger un réseau informatique en empêchant les accès non autorisés.',_binary '',46),(160,_binary '\0','Un pare-feu est un logiciel antivirus.',_binary '\0',46),(161,_binary '\0','Un pare-feu est un outil pour accélérer la vitesse de la connexion Internet.',_binary '\0',46),(162,_binary '\0','Le phishing est une technique d\'attaque utilisée par des cybercriminels pour obtenir des informations sensibles telles que des identifiants de connexion, des numéros de carte de crédit, etc., en se faisant passer pour une entité de confiance dans une communication électronique.',_binary '',47),(163,_binary '\0','Le phishing est une méthode de cryptage de données sensibles.',_binary '\0',47),(164,_binary '\0','Le phishing est une méthode pour accéder à distance à un réseau Wi-Fi.',_binary '\0',47),(165,_binary '\0','Un logiciel malveillant (malware) est un programme informatique conçu pour causer des dommages à un système informatique, voler des données ou perturber les opérations normales.',_binary '',48),(166,_binary '\0','Un logiciel malveillant (malware) est un logiciel officiellement autorisé par une entreprise.',_binary '\0',48),(167,_binary '\0','Un logiciel malveillant (malware) est un logiciel de sécurité informatique.',_binary '\0',48),(168,_binary '\0','Les principales étapes d\'une cyberattaque comprennent l\'identification de la cible, la collecte d\'informations, l\'exécution de l\'attaque, l\'exploitation des vulnérabilités et la persistance dans le système compromis.',_binary '',49),(169,_binary '\0','Les principales étapes d\'une cyberattaque comprennent uniquement l\'exécution de l\'attaque.',_binary '\0',49),(170,_binary '\0','Les principales étapes d\'une cyberattaque comprennent uniquement la collecte d\'informations.',_binary '\0',49),(171,_binary '\0','L\'ingénierie sociale en matière de sécurité informatique consiste à manipuler les individus afin de leur faire divulguer des informations confidentielles ou d\'accéder à des systèmes protégés.',_binary '',50),(172,_binary '\0','L\'ingénierie sociale en matière de sécurité informatique consiste uniquement à sécuriser les réseaux sociaux.',_binary '\0',50),(173,_binary '\0','L\'ingénierie sociale en matière de sécurité informatique consiste uniquement à tester les pare-feux.',_binary '\0',50),(174,_binary '\0','Les meilleures pratiques pour sécuriser un réseau sans fil (Wi-Fi) comprennent l\'utilisation d\'un chiffrement fort tel que WPA2, la désactivation du SSID broadcast, la configuration de pare-feu sur le routeur, et la gestion des identifiants et des mots de passe.',_binary '',51),(175,_binary '\0','Les meilleures pratiques pour sécuriser un réseau sans fil (Wi-Fi) comprennent uniquement l\'utilisation d\'un nom de réseau (SSID) facile à deviner.',_binary '\0',51),(176,_binary '\0','Les meilleures pratiques pour sécuriser un réseau sans fil (Wi-Fi) comprennent uniquement l\'utilisation d\'un mot de passe simple.',_binary '\0',51),(177,_binary '\0','Un VPN (Virtual Private Network) est un service qui permet de créer un réseau privé virtuel sécurisé sur Internet. Il fonctionne en cryptant la connexion Internet de l\'utilisateur et en la faisant passer par un serveur VPN sécurisé avant d\'atteindre sa destination.',_binary '',52),(178,_binary '\0','Un VPN est un logiciel de piratage informatique.',_binary '\0',52),(179,_binary '\0','Un VPN est un service de stockage de fichiers en ligne.',_binary '\0',52),(180,_binary '\0','Analyser le problème',_binary '\0',53),(181,_binary '\0','Définir le problème',_binary '',53),(182,_binary '\0','Trouver une solution',_binary '\0',53),(183,_binary '\0','Mettre en œuvre la solution',_binary '\0',53),(184,_binary '\0','Une méthode pour résoudre des problèmes',_binary '\0',54),(185,_binary '\0','Une méthode pour trouver des solutions créatives',_binary '',54),(186,_binary '\0','Une méthode de réflexion rapide',_binary '\0',54),(187,_binary '\0','Une méthode d\'analyse statistique',_binary '\0',54),(188,_binary '\0','Identification du problème, recherche de solutions, sélection de la meilleure solution, mise en œuvre de la solution.',_binary '',56),(189,_binary '\0','Analyse du problème, recherche de solutions, évaluation des options, prise de décision.',_binary '\0',56),(190,_binary '\0','Analyse du problème, génération d\'idées, sélection de la solution la plus appropriée, mise en œuvre de la solution.',_binary '\0',56),(191,_binary '\0','Identification du problème, recherche de solutions, évaluation des alternatives, mise en œuvre de la solution.',_binary '\0',56),(192,_binary '\0','Analyse SWOT est une méthode pour évaluer les forces, les faiblesses, les opportunités et les menaces d\'une situation ou d\'une organisation. Elle peut être utilisée pour identifier les domaines à améliorer ou à exploiter dans un contexte de résolution de problèmes.',_binary '',57),(193,_binary '\0','Analyse SWOT est une méthode pour déterminer les coûts et les avantages d\'une solution potentielle. Elle peut être utilisée pour évaluer les conséquences financières de différentes options de résolution de problèmes.',_binary '\0',57),(194,_binary '\0','Analyse SWOT est une méthode pour déterminer les étapes nécessaires à la mise en œuvre d\'une solution. Elle peut être utilisée pour planifier la séquence d\'actions à prendre lors de la résolution d\'un problème.',_binary '\0',57),(195,_binary '\0','Analyse SWOT est une méthode pour évaluer les réactions émotionnelles des parties prenantes à une situation donnée. Elle peut être utilisée pour anticiper les obstacles psychologiques lors de la résolution de problèmes.',_binary '\0',57),(196,_binary '\0','Clarté, spécificité, pertinence, réalisabilité, évaluation.',_binary '',58),(197,_binary '\0','Complexité, généralité, subjectivité, vitesse, acceptation.',_binary '\0',58),(198,_binary '\0','Originalité, unicité, irréalisme, inaccessibilité, évaluation.',_binary '\0',58),(199,_binary '\0','Clarté, généralité, pertinence, réalisabilité, acceptation.',_binary '\0',58),(200,_binary '\0','La méthode des 5 Pourquoi consiste à poser la question \"pourquoi\" plusieurs fois pour creuser plus profondément dans les causes d\'un problème. Elle peut être appliquée pour identifier les causes sous-jacentes d\'un problème et ainsi trouver des solutions plus efficaces.',_binary '',59),(201,_binary '\0','La méthode des 5 Pourquoi consiste à poser la question \"pourquoi\" cinq fois pour générer des idées créatives. Elle peut être utilisée pour stimuler la pensée latérale et encourager l\'innovation.',_binary '\0',59),(202,_binary '\0','La méthode des 5 Pourquoi consiste à poser cinq questions différentes sur un problème pour obtenir une compréhension complète de sa nature. Elle peut être utilisée pour évaluer les différents aspects d\'une situation et ainsi prendre des décisions éclairées.',_binary '\0',59),(203,_binary '\0','La méthode des 5 Pourquoi consiste à poser cinq questions de nature philosophique sur un problème pour explorer ses implications plus profondes. Elle peut être utilisée pour engager une réflexion approfondie sur les questions existentielles.',_binary '\0',59),(204,_binary '\0','Une variable représente une donnée stockée en mémoire, pouvant être modifiée ou manipulée par le programme.',_binary '',60),(205,_binary '\0','Une variable est une fonction en programmation.',_binary '\0',60),(206,_binary '\0','Une variable est un type de boucle en programmation.',_binary '\0',60),(207,_binary '\0','Une variable est un type de condition en programmation.',_binary '\0',60),(208,_binary '\0','Une fonction est un bloc de code qui effectue une tâche spécifique et peut être appelé de n\'importe où dans le programme, tandis qu\'une méthode est une fonction associée à un objet ou à une classe spécifique.',_binary '',61),(209,_binary '\0','Il n\'y a pas de différence entre une fonction et une méthode en programmation.',_binary '\0',61),(210,_binary '\0','Une méthode est utilisée pour exécuter une opération unique, tandis qu\'une fonction est utilisée pour exécuter plusieurs opérations.',_binary '\0',61),(211,_binary '\0','Une fonction est utilisée dans la programmation impérative, tandis qu\'une méthode est utilisée dans la programmation déclarative.',_binary '\0',61),(212,_binary '\0','Une boucle for est une structure de contrôle qui permet d\'exécuter une séquence d\'instructions plusieurs fois en fonction d\'une condition.',_binary '',62),(213,_binary '\0','Une boucle for est utilisée pour déclarer une variable en programmation.',_binary '\0',62),(214,_binary '\0','Une boucle for est une instruction de condition en programmation.',_binary '\0',62),(215,_binary '\0','Une boucle for est une structure de données en programmation.',_binary '\0',62),(216,_binary '\0','L\'opérateur \"==\" compare deux valeurs en vérifiant si elles sont égales, tandis que l\'opérateur \"===\" compare non seulement les valeurs, mais aussi les types de données.',_binary '',63),(217,_binary '\0','L\'opérateur \"==\" compare deux valeurs sans vérifier leur type de données, tandis que l\'opérateur \"===\" compare les types de données ainsi que les valeurs.',_binary '\0',63),(218,_binary '\0','L\'opérateur \"==\" compare les types de données, tandis que l\'opérateur \"===\" compare seulement les valeurs.',_binary '\0',63),(219,_binary '\0','Il n\'y a pas de différence entre les opérateurs \"==\" et \"===\". Ils sont utilisés de la même manière en programmation.',_binary '\0',63),(220,_binary '\0','Un tableau (array) est une structure de données qui permet de stocker plusieurs valeurs de types différents sous un même nom, accessibles via des index numériques.',_binary '',64),(221,_binary '\0','Un tableau (array) est une fonction en programmation.',_binary '\0',64),(222,_binary '\0','Un tableau (array) est une boucle en programmation.',_binary '\0',64),(223,_binary '\0','Un tableau (array) est une variable en programmation.',_binary '\0',64),(224,_binary '\0','Une classe est un modèle pour créer des objets qui partagent les mêmes attributs et méthodes. Elle définit les propriétés et le comportement d\'un type d\'objet.',_binary '',65),(225,_binary '\0','Une classe est un type de boucle en programmation.',_binary '\0',65),(226,_binary '\0','Une classe est une fonction en programmation.',_binary '\0',65),(227,_binary '\0','Une classe est une variable en programmation.',_binary '\0',65),(228,_binary '\0','Un algorithme de tri est un algorithme qui organise une liste d\'éléments dans un certain ordre. Un exemple d\'algorithme de tri est le tri à bulles, qui compare les éléments adjacents et les échange s\'ils sont dans le mauvais ordre.',_binary '',66),(229,_binary '\0','Un algorithme de tri est un algorithme qui recherche un élément dans une liste. Un exemple d\'algorithme de tri est la recherche binaire.',_binary '\0',66),(230,_binary '\0','Un algorithme de tri est un algorithme qui ajoute des éléments à une liste. Un exemple d\'algorithme de tri est le tri par sélection.',_binary '\0',66),(231,_binary '\0','Un algorithme de tri est un algorithme qui supprime des éléments d\'une liste. Un exemple d\'algorithme de tri est le tri par insertion.',_binary '\0',66),(232,_binary '\0','Un algorithme de tri est un algorithme qui organise une liste d\'éléments dans un ordre particulier, comme par exemple du plus petit au plus grand. Un exemple d\'utilisation en programmation est l\'algorithme de tri rapide (quicksort) utilisé pour trier des tableaux ou des listes.',_binary '',66),(233,_binary '\0','Un algorithme de tri est un algorithme qui effectue une multiplication de deux nombres. Un exemple d\'utilisation en programmation est l\'algorithme naïf de multiplication utilisé pour effectuer des opérations mathématiques.',_binary '\0',66),(234,_binary '\0','Un algorithme de tri est un algorithme qui convertit un nombre décimal en binaire. Un exemple d\'utilisation en programmation est l\'algorithme de conversion de nombre utilisé pour convertir des nombres entre différents systèmes de numération.',_binary '\0',66),(235,_binary '\0','Un algorithme de tri est un algorithme qui recherche un élément dans une liste triée. Un exemple d\'utilisation en programmation est l\'algorithme de recherche binaire utilisé pour trouver un élément dans un tableau trié.',_binary '\0',66),(236,_binary '\0','Un algorithme est une série d\'instructions pour résoudre un problème ou accomplir une tâche donnée.',_binary '',67),(237,_binary '\0','Un algorithme est un programme informatique écrit en langage naturel.',_binary '\0',67),(238,_binary '\0','Un algorithme est une structure de données en informatique.',_binary '\0',67),(239,_binary '\0','Un algorithme est un concept abstrait en mathématiques.',_binary '\0',67),(240,_binary '\0','Un algorithme est une série d\'instructions pour résoudre un problème, tandis qu\'un programme informatique est un ensemble d\'instructions écrit en langage de programmation exécutables par un ordinateur.',_binary '',68),(241,_binary '\0','Il n\'y a pas de différence entre un algorithme et un programme informatique.',_binary '\0',68),(242,_binary '\0','Un algorithme est un programme informatique.',_binary '\0',68),(243,_binary '\0','Un programme informatique est une représentation graphique d\'un algorithme.',_binary '\0',68),(244,_binary '\0','Un algorithme récursif est un algorithme qui s\'appelle lui-même.',_binary '',69),(245,_binary '\0','Un algorithme récursif est un algorithme qui ne se termine jamais.',_binary '\0',69),(246,_binary '\0','Un algorithme récursif est un algorithme qui utilise des fonctions récursives.',_binary '\0',69),(247,_binary '\0','Un algorithme récursif est un algorithme qui génère des nombres aléatoires.',_binary '\0',69),(248,_binary '\0','La complexité algorithmique mesure les performances et les ressources nécessaires à l\'exécution d\'un algorithme.',_binary '',70),(249,_binary '\0','La complexité algorithmique mesure la complexité syntaxique d\'un algorithme.',_binary '\0',70),(250,_binary '\0','La complexité algorithmique mesure le nombre d\'étapes nécessaires à l\'exécution d\'un algorithme.',_binary '\0',70),(251,_binary '\0','La complexité algorithmique mesure la taille de l\'espace mémoire utilisé par un algorithme.',_binary '\0',70),(252,_binary '\0','Un algorithme de tri est un algorithme qui organise une liste d\'éléments dans un ordre particulier, comme par exemple du plus petit au plus grand.',_binary '',71),(253,_binary '\0','Un algorithme de tri est un algorithme qui effectue une multiplication de deux nombres.',_binary '\0',71),(254,_binary '\0','Un algorithme de tri est un algorithme qui convertit un nombre décimal en binaire.',_binary '\0',71),(255,_binary '\0','Un algorithme de tri est un algorithme qui recherche un élément dans une liste triée.',_binary '\0',71),(256,_binary '\0','Un graphe en informatique est une structure de données qui représente des relations entre des objets.',_binary '',72),(257,_binary '\0','Un graphe en informatique est une représentation graphique d\'un algorithme.',_binary '\0',72),(258,_binary '\0','Un graphe en informatique est un outil de modélisation de bases de données.',_binary '\0',72),(259,_binary '\0','Un graphe en informatique est une méthode de cryptographie.',_binary '\0',72),(260,_binary '\0','Un arbre binaire est une structure de données hiérarchique composée de nœuds, où chaque nœud a au plus deux enfants.',_binary '',73),(261,_binary '\0','Un arbre binaire est un arbre qui n\'a qu\'un seul enfant.',_binary '\0',73),(262,_binary '\0','Un arbre binaire est un arbre dont chaque nœud a exactement trois enfants.',_binary '\0',73),(263,_binary '\0','Un arbre binaire est un arbre qui n\'a pas de nœuds enfants.',_binary '\0',73);
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
  `birth_date_candidate` date DEFAULT NULL,
  `phone_number_candidate` varchar(15) DEFAULT NULL,
  `professional_profile_url_candidate` varchar(100) DEFAULT NULL,
  `updated_at_candidate` datetime(6) DEFAULT NULL,
  `created_at_candidate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_candidate`),
  UNIQUE KEY `UKf561h1al044dxprl8q9eqffm0` (`mail_candidate`),
  KEY `FKk87qkxunki5wa1he5u8qpboo8` (`fk_person`),
  CONSTRAINT `FKk87qkxunki5wa1he5u8qpboo8` FOREIGN KEY (`fk_person`) REFERENCES `person` (`id_person`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
INSERT INTO `candidate` VALUES (1,_binary '\0','boblebrun@gmail.com','$2a$10$BUCqlAhYSmFZcQSG17NjjeGn9a5HEnuUoNYH.M55bfvsNJdUt7GBi',1,NULL,NULL,NULL,NULL,NULL),(2,_binary '\0','tjhannart@gmail.com','$2a$10$NEW3h/5olK8iAWfHZdlT/.4LDjQHc3np.gsTYFPU7qCth7WK7UP/K',2,'2024-05-21',NULL,'www.linkedin.com/in/thierry-julien-hannart-76a113256',NULL,NULL),(3,_binary '\0','jean.dupont@example.com','$2a$10$s5VBFU.0Gx2mOaZ/H1h3muUx9WwPWfgv7/WWXXtGk6k0KR47aC81a',4,'1985-04-12',NULL,NULL,NULL,NULL),(4,_binary '\0','sophie.martin@example.com','$2a$10$FcqEuv4f4gGQpTcdQoak2ePrazQtnIYrQDm7MLnuGtsK.8WcUHjO.',5,'1990-07-23',NULL,NULL,NULL,NULL),(5,_binary '\0','paul.bernard@example.com','$2a$10$U.FcgXzem3SYka.xHmAtQuXbUtaDmSAypsCdgyZ1J4ebzGozdbx2y',6,'1988-11-30',NULL,NULL,NULL,NULL),(6,_binary '\0','marie.petit@example.com','$2a$10$dqOFa4bEtPBdwsqchmJAn.xGTEYzYZ5jK5GZ.eDHVRK4rZ3k9XdiK',7,'2024-05-13',NULL,NULL,NULL,NULL),(7,_binary '\0','luc.durand@example.com','$2a$10$Co3XPBpy1e9XumzjNlRH6uI6AKsC26PCpW2LKX1MfSznLRg7q3Zr2',8,'1983-06-17',NULL,NULL,NULL,NULL),(8,_binary '\0','julie.lefevre@example.com','$2a$10$arqq1Q6XuYv1zwvlEBCdSeU7dqgGL1d1U7BbBAGKy5sCI64as67S.',9,'1995-01-22',NULL,NULL,NULL,NULL),(9,_binary '\0','antoine.moreau@example.com','$2a$10$JaSL7.vJC40OhkZxqQVd5eLVHGIGOPnbh0.6cgml26jjErEUmdAPm',10,'1995-09-05',NULL,NULL,NULL,NULL),(10,_binary '\0','camille.laurent@example.com','$2a$10$ACLwrE78U8mnupwZfnCnoubSud5WFC1CUjUNzdkEUvz4FiDViGrcK',11,'1991-02-19',NULL,NULL,NULL,NULL),(11,_binary '\0','emma.simon@example.com','$2a$10$OLkeR0PyaXCvgsTgzICD7OJQdqAkzqZyt1wi4IyB4idoCJURZW6g6',12,'1989-08-14',NULL,NULL,NULL,NULL),(12,_binary '\0','louis.rousseau@example.com','$2a$10$Z8ttAWzDgweU.VzvOalaoujEH/tiCdYooOYpcMDVb0/x4SSqdAgEC',13,'1993-12-09',NULL,NULL,NULL,NULL),(13,_binary '\0','jeromevaret@gmail.com','$2a$10$0.gBho6LgkoQhXkGb4s87uJ.TRhD2wululwvhv2ljbOAxuSzzRl3C',14,NULL,NULL,NULL,NULL,NULL),(14,_binary '\0','leonetcorentin@gmail.com','$2a$10$wrYLOB8B5dpjzvSK6JbZ4.df5NGSyJbGwCbFmeaUm3AOY2tscHVku',15,NULL,NULL,NULL,NULL,NULL),(15,_binary '\0','e20417@eps-marche.be','$2a$10$gGrYOINE9uNUHeg1lO6Um.w0qEVRp8HxlOpC9cqsYWqCBcXYZdkTW',18,'1988-12-10','02013050',NULL,NULL,NULL),(16,_binary '\0','anonymized16@mail.com','$2a$10$xe43gTqvC8WHR/RQ0IphJeezzzco2BqnYRI.8G3MXGkPy6U6k42BW',19,NULL,'','','2024-05-29 17:15:35.859365','2024-05-29 15:49:19.970842'),(17,_binary '\0','anonymized17@mail.com','$2a$10$/5g35M/pZVfDT/eqEyJx6.yRMFDWJW3kcbBWoQ8DaCc96gEC.7cxe',20,NULL,'','','2024-05-29 17:19:16.929626','2024-05-29 17:18:55.730551');
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
  `fk_candidate` int DEFAULT NULL,
  `fk_test` int DEFAULT NULL,
  `assigned_at_candidate_test` datetime(6) DEFAULT NULL,
  `ended_at_candidate_test` datetime(6) DEFAULT NULL,
  `score_candidate_test` double DEFAULT NULL,
  `started_at_candidate_test` datetime(6) DEFAULT NULL,
  `status_candidate_test` varchar(50) DEFAULT NULL,
  `results_shared_candidate_test` bit(1) NOT NULL,
  PRIMARY KEY (`id_candidate_test`),
  KEY `FKfv2ogsdb3gg94w1ftpd8l8jy2` (`fk_candidate`),
  KEY `FKhp5ohu1mkk7k58cdxvxmgb503` (`fk_test`),
  CONSTRAINT `FKfv2ogsdb3gg94w1ftpd8l8jy2` FOREIGN KEY (`fk_candidate`) REFERENCES `candidate` (`id_candidate`),
  CONSTRAINT `FKhp5ohu1mkk7k58cdxvxmgb503` FOREIGN KEY (`fk_test`) REFERENCES `test` (`id_test`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_test`
--

LOCK TABLES `candidate_test` WRITE;
/*!40000 ALTER TABLE `candidate_test` DISABLE KEYS */;
INSERT INTO `candidate_test` VALUES (227,2,18,'2024-05-20 13:34:29.017000','2024-05-20 14:09:23.366000',0,'2024-05-20 14:09:07.645000','fraudSuspicion',_binary '\0'),(228,6,18,'2024-05-20 14:10:32.521000','2024-05-20 14:27:31.153000',11.5,'2024-05-20 14:25:53.263000','ended',_binary ''),(229,5,18,'2024-05-20 14:25:33.858000','2024-05-20 14:28:14.409000',2.25,'2024-05-20 14:28:05.077000','ended',_binary '\0'),(230,1,18,'2024-05-20 14:28:46.689000','2024-05-20 14:29:16.958000',5,'2024-05-20 14:29:08.425000','ended',_binary '\0'),(231,15,18,'2024-05-20 18:32:15.661000','2024-05-20 18:33:09.996000',3.25,'2024-05-20 18:32:58.778000','ended',_binary '\0'),(232,15,18,'2024-05-20 18:32:49.257000','2024-05-20 18:33:47.854000',0,'2024-05-20 18:33:45.627000','fraudSuspicion',_binary '\0'),(233,15,18,'2024-05-20 18:32:52.207000','2024-05-20 18:34:23.485000',0,'2024-05-20 18:33:58.073000','fraudSuspicion',_binary '\0'),(234,15,18,'2024-05-20 18:33:37.720000','2024-05-20 18:36:23.212000',4,'2024-05-20 18:34:30.321000','ended',_binary '\0'),(237,4,18,'2024-05-20 20:53:28.329000','2024-05-20 20:56:22.398000',0,'2024-05-20 20:55:27.356000','fraudSuspicion',_binary '\0'),(238,3,18,'2024-05-27 08:49:32.724000',NULL,0,NULL,'assigned',_binary '\0'),(239,10,18,'2024-05-27 08:49:45.476000',NULL,0,NULL,'assigned',_binary '\0'),(240,9,18,'2024-05-27 08:50:03.608000','2024-05-27 08:54:42.523000',0,'2024-05-27 08:51:04.783000','fraudSuspicion',_binary '\0'),(241,5,18,'2024-05-29 15:50:59.760000','2024-05-29 15:52:16.576000',5,'2024-05-29 15:51:37.072000','ended',_binary '\0');
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
  `updated_at_hr_manager` datetime(6) DEFAULT NULL,
  `created_at_hr_manager` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_hr_manager`),
  UNIQUE KEY `UKeiag9k1s7049s9jubhwucj32m` (`mail_hr_manager`),
  KEY `FK94bn80yyu29rdcurxi30cdec6` (`fk_person`),
  CONSTRAINT `FK94bn80yyu29rdcurxi30cdec6` FOREIGN KEY (`fk_person`) REFERENCES `person` (`id_person`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_manager`
--

LOCK TABLES `hr_manager` WRITE;
/*!40000 ALTER TABLE `hr_manager` DISABLE KEYS */;
INSERT INTO `hr_manager` VALUES (1,_binary '\0','laurentphilippe@gmail.com','$2a$10$Aby9e/40zUYFuySGMtjZA.Phe7O/1WxNdH7XjmZlPTUubn2nHLeCO',3,NULL,NULL),(2,_binary '\0','fakehr2@gmail.com','$2a$10$Aby9e/40zUYFuySGMtjZA.Phe7O/1WxNdH7XjmZlPTUubn2nHLeCO',16,NULL,NULL),(3,_binary '\0','fakehr3@gmail.com','$2a$10$Aby9e/40zUYFuySGMtjZA.Phe7O/1WxNdH7XjmZlPTUubn2nHLeCO',17,NULL,NULL);
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
  `data_erasure_requested_at_person` datetime(6) DEFAULT NULL,
  `consent_given_at_person` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_person`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,_binary '\0','Candidate at Aubay','Bob','Le Brun',NULL,NULL),(2,_binary '\0','Stagiaire chez Aubay','Thierry-Julien','Hannart',NULL,NULL),(3,_binary '\0','Computer Software Recruiter','Philippe','Laurent',NULL,NULL),(4,_binary '\0','','Jean','Dupont',NULL,NULL),(5,_binary '\0','','Sophie','Martin',NULL,NULL),(6,_binary '\0','','Paul','Bernard',NULL,NULL),(7,_binary '\0','','Marie','Petit',NULL,NULL),(8,_binary '\0','','luc','Durand',NULL,NULL),(9,_binary '\0','','julie','Lefevre',NULL,NULL),(10,_binary '\0','','Antoine','Moreau',NULL,NULL),(11,_binary '\0','','Camille','Laurent',NULL,NULL),(12,_binary '\0','','Emma','Simon',NULL,NULL),(13,_binary '\0','','Louis','Rousseau',NULL,NULL),(14,_binary '\0','','Jerome','Varet',NULL,NULL),(15,_binary '\0','','Corentin','Leonet',NULL,NULL),(16,_binary '\0','hr account 2','2','fake hr',NULL,NULL),(17,_binary '\0','hr account 3','3','fake hr',NULL,NULL),(18,_binary '\0','','Arnaud','Van Humbeeck',NULL,NULL),(19,_binary '\0','','Anonymized','Anonymized',NULL,'2024-05-29 15:49:19.753000'),(20,_binary '\0','','Anonymized','Anonymized','2024-05-29 17:19:16.910932','2024-05-29 17:18:55.338000');
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
  `weight_question` int NOT NULL,
  `fk_questionnaire` int DEFAULT NULL,
  `fk_topic` int DEFAULT NULL,
  `max_duration_in_seconds_question` int NOT NULL,
  PRIMARY KEY (`id_question`),
  KEY `FKb5a21ulxfbx2tvi68tqx8jmee` (`fk_questionnaire`),
  KEY `FK421u8e57vbn6kqyrd2sxrdn58` (`fk_topic`),
  CONSTRAINT `FK421u8e57vbn6kqyrd2sxrdn58` FOREIGN KEY (`fk_topic`) REFERENCES `topic` (`id_topic`),
  CONSTRAINT `FKb5a21ulxfbx2tvi68tqx8jmee` FOREIGN KEY (`fk_questionnaire`) REFERENCES `questionnaire` (`id_questionnaire`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,_binary '\0','Quelle est la fonction trigonométrique qui représente le rapport entre le côté opposé et l\'hypoténuse dans un triangle rectangle?',5,2,1,1,61),(2,_binary '\0','Quelle est la période de la fonction sinus?',2,3,1,1,60),(3,_binary '\0','Quelle est la relation fondamentale entre les fonctions trigonométriques sinus et cosinus dans un triangle rectangle?',100,3,1,1,60),(4,_binary '\0','Quel est l\'ingrédient principal de la sauce carbonara italienne?',1,3,2,2,60),(5,_binary '\0','Quel est l\'ingrédient de base pour faire une pizza margherita?',1,3,2,2,60),(6,_binary '\0','Quel type de pâtes est utilisé traditionnellement dans le plat italien \"spaghetti alla puttanesca\"?',1,3,2,2,60),(15,_binary '','test question added on the fly in a test',10,10,4,5,60),(18,_binary '\0','Qu\'est-ce que la technique de cuisson à la vapeur ?',1,1,25,6,60),(19,_binary '\0','Quel est l\'ingrédient principal dans une ratatouille ?',1,1,25,6,60),(20,_binary '\0','Combien de minutes faut-il pour cuire des pâtes al dente ?',1,1,25,6,60),(21,_binary '\0','Quelle est la différence entre une poêle et une casserole ?',1,1,25,6,60),(22,_binary '\0','Quelle épice est souvent utilisée dans la cuisine indienne ?',1,1,25,6,60),(23,_binary '\0','Quelle est la technique de cuisson qui utilise le four à micro-ondes ?',1,1,25,6,60),(24,_binary '\0','Quel est l\'ingrédient principal dans un risotto ?',1,1,25,6,60),(25,_binary '\0','Quelle est la capitale de la France ?',1,1,19,8,30),(26,_binary '\0','Quel est le plus grand pays du monde en termes de superficie ?',1,1,19,8,30),(27,_binary '\0','Quelle est la plus grande île du monde ?',1,1,19,8,30),(28,_binary '\0','Quel est le plus grand océan du monde ?',1,1,19,8,30),(29,_binary '\0','Quel est le fleuve le plus long du monde ?',1,1,19,8,30),(30,_binary '\0','Quel pays est situé à la fois en Europe et en Asie ?',1,1,19,8,30),(31,_binary '\0','Quelle est la plus haute montagne du monde ?',1,1,19,8,30),(32,_binary '\0','Que faire en cas de brûlure légère ?',1,1,21,10,60),(33,_binary '\0','Comment agir face à une personne étouffée ?',1,1,21,10,90),(34,_binary '\0','Quelles sont les étapes à suivre pour effectuer une réanimation cardio-pulmonaire ?',2,2,21,10,120),(35,_binary '\0','Comment reconnaître les signes d\'un arrêt cardiaque ?',1.5,1,21,10,90),(36,_binary '\0','Quels sont les gestes à réaliser en cas de saignement abondant ?',2,2,21,10,120),(37,_binary '\0','Comment identifier les symptômes d\'une fracture ?',1.5,1,21,10,90),(38,_binary '\0','Que faire en cas de malaise ?',1,1,21,10,60),(39,_binary '\0','Quelle est la définition du protocole TCP/IP ?',1,1,22,11,60),(40,_binary '\0','Qu\'est-ce que le DNS ?',1,1,22,11,60),(41,_binary '\0','Qu\'est-ce que le Wi-Fi ?',1,1,22,11,60),(42,_binary '\0','Qu\'est-ce que le Bluetooth ?',1,1,22,11,60),(43,_binary '\0','Quelle est la différence entre un routeur et un commutateur ?',1,1,22,11,60),(44,_binary '\0','Qu\'est-ce qu\'un pare-feu (firewall) ?',1,1,22,11,60),(45,_binary '\0','Quelle est la différence entre un modem et un routeur ?',1,1,22,11,60),(46,_binary '\0','Qu\'est-ce qu\'un pare-feu et quelle est son rôle dans la sécurité informatique ?',1,1,26,11,60),(47,_binary '\0','Qu\'est-ce qu\'une attaque de type phishing ?',1,1,26,11,60),(48,_binary '\0','Qu\'est-ce qu\'un logiciel malveillant (malware) ?',1,1,26,11,60),(49,_binary '\0','Quelles sont les principales étapes d\'une cyberattaque ?',1,1,26,11,60),(50,_binary '\0','Qu\'est-ce que l\'ingénierie sociale en matière de sécurité informatique ?',1,1,26,11,60),(51,_binary '\0','Quelles sont les meilleures pratiques pour sécuriser un réseau sans fil (Wi-Fi) ?',1,1,26,11,60),(52,_binary '\0','Qu\'est-ce qu\'un VPN et comment fonctionne-t-il pour assurer la sécurité des données ?',1,1,26,11,60),(53,_binary '\0','Quelle est la première étape pour résoudre un problème complexe ?',1,1,23,12,60),(54,_binary '\0','Qu\'est-ce que la pensée latérale ?',1,1,23,12,60),(56,_binary '\0','Quelles sont les différentes étapes du processus de résolution de problèmes ?',1,1,23,12,60),(57,_binary '\0','Qu\'est-ce que l\'analyse SWOT et comment peut-elle être utilisée pour résoudre un problème ?',1,1,23,12,60),(58,_binary '\0','Quelles sont les caractéristiques d\'un bon problème ?',1,1,23,12,60),(59,_binary '\0','Qu\'est-ce que la méthode des 5 Pourquoi et comment peut-elle être appliquée pour résoudre un problème ?',1,1,23,12,60),(60,_binary '\0','Qu\'est-ce qu\'une variable en programmation ?',1,3,27,7,60),(61,_binary '\0','Quelle est la différence entre une fonction et une méthode ?',1,1,27,7,60),(62,_binary '\0','Qu\'est-ce qu\'une boucle for ?',1,1,27,7,60),(63,_binary '\0','Expliquez la différence entre les opérateurs \"==\" et \"===\" en JavaScript.',1,1,27,7,60),(64,_binary '\0','Qu\'est-ce qu\'un tableau (array) en programmation ?',1,1,27,7,60),(65,_binary '\0','Qu\'est-ce qu\'une classe en programmation orientée objet ?',1,1,27,7,60),(66,_binary '\0','Qu\'est-ce qu\'un algorithme de tri et donnez un exemple de son utilisation en programmation.',1,1,27,7,60),(67,_binary '\0','Qu\'est-ce qu\'un algorithme ?',1,1,28,7,60),(68,_binary '\0','Quelle est la différence entre un algorithme et un programme informatique ?',1,1,28,7,60),(69,_binary '\0','Qu\'est-ce qu\'un algorithme récursif ?',1,1,28,7,60),(70,_binary '\0','Qu\'est-ce que la complexité algorithmique ?',1,1,28,7,60),(71,_binary '\0','Qu\'est-ce qu\'un algorithme de tri ?',1,1,28,7,60),(72,_binary '\0','Qu\'est-ce qu\'un graphe en informatique ?',1,1,28,7,60),(73,_binary '\0','Qu\'est-ce qu\'un arbre binaire ?',1,1,28,7,60);
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
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_test`
--

LOCK TABLES `question_test` WRITE;
/*!40000 ALTER TABLE `question_test` DISABLE KEYS */;
INSERT INTO `question_test` VALUES (93,32,18),(94,35,18),(95,34,18),(96,33,18),(97,36,18),(98,37,18),(99,38,18);
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
  `description_questionnaire` varchar(3000) DEFAULT NULL,
  `label_questionnaire` varchar(500) NOT NULL,
  `fk_topic` int DEFAULT NULL,
  `created_at_questionnaire` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_questionnaire`),
  KEY `FK4yta7upqdme7olmsjittfxxbt` (`fk_topic`),
  CONSTRAINT `FK4yta7upqdme7olmsjittfxxbt` FOREIGN KEY (`fk_topic`) REFERENCES `topic` (`id_topic`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire`
--

LOCK TABLES `questionnaire` WRITE;
/*!40000 ALTER TABLE `questionnaire` DISABLE KEYS */;
INSERT INTO `questionnaire` VALUES (1,_binary '\0','Questionnaire sur la trigo','Trigonométrie',1,'2024-05-19 13:17:10.652000'),(2,_binary '\0','La cuisina dé la mama','Cuisine italienne',2,'2024-05-19 13:17:10.000000'),(4,_binary '\0','','On the fly',5,'2024-05-19 13:17:10.000000'),(19,_binary '\0','Questionnaire sur la culture générale : géographie','Culture générale - Géographie',8,'2024-05-19 15:53:34.000000'),(21,_binary '\0','Questionnaire sur les notions liées au secourisme','Secourisme',10,'2024-05-19 15:53:34.000000'),(22,_binary '\0','Questionnaire sur la technologie : innovations, tendances, gadgets, etc.','Technologie - Connectivité',11,'2024-05-19 15:53:34.000000'),(23,_binary '\0','Questionnaire sur les compétences générales : communication, résolution de problèmes, travail d\'équipe, etc.','Compétences générales - Résolution de problèmes',12,'2024-05-19 15:53:34.000000'),(25,_binary '\0','Questionnaire sur la cuisine : techniques, ustensiles, astuces, etc.','Cuisine',6,'2024-05-19 15:53:34.000000'),(26,_binary '\0','','Technologie - Cybersécurité',11,'2024-05-19 16:20:10.180000'),(27,_binary '\0','Questionnaire sur les langages de programmation : syntaxe, concepts, bonnes pratiques, etc.','Langages de programmation',7,'2024-05-19 16:32:43.000000'),(28,_binary '\0','Questionnaire sur les algorithmes : types d\'algorithmes, complexité, optimisation, etc.','Algorithmes',7,'2024-05-19 16:32:43.000000');
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
) ENGINE=InnoDB AUTO_INCREMENT=1380 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `result`
--

LOCK TABLES `result` WRITE;
/*!40000 ALTER TABLE `result` DISABLE KEYS */;
INSERT INTO `result` VALUES (1212,_binary '\0',123,228,35),(1213,_binary '',122,228,35),(1214,_binary '\0',113,228,32),(1215,_binary '',110,228,32),(1216,_binary '\0',112,228,32),(1217,_binary '\0',111,228,32),(1218,_binary '',118,228,34),(1219,_binary '\0',119,228,34),(1220,_binary '\0',124,228,35),(1221,_binary '\0',125,228,35),(1222,_binary '\0',120,228,34),(1223,_binary '\0',121,228,34),(1224,_binary '\0',116,228,33),(1225,_binary '\0',114,228,33),(1226,_binary '',126,228,36),(1227,_binary '',115,228,33),(1228,_binary '\0',127,228,36),(1229,_binary '\0',117,228,33),(1230,_binary '\0',128,228,36),(1231,_binary '\0',129,228,36),(1232,_binary '',131,228,37),(1233,_binary '\0',132,228,37),(1234,_binary '',130,228,37),(1235,_binary '',133,228,37),(1236,_binary '',134,228,38),(1237,_binary '\0',135,228,38),(1238,_binary '\0',136,228,38),(1239,_binary '\0',137,228,38),(1240,_binary '\0',110,229,32),(1241,_binary '',113,229,32),(1242,_binary '\0',112,229,32),(1243,_binary '\0',111,229,32),(1244,_binary '',122,229,35),(1245,_binary '\0',123,229,35),(1246,_binary '\0',118,229,34),(1247,_binary '\0',125,229,35),(1248,_binary '\0',124,229,35),(1249,_binary '',119,229,34),(1250,_binary '\0',121,229,34),(1251,_binary '\0',120,229,34),(1252,_binary '',114,229,33),(1253,_binary '\0',116,229,33),(1254,_binary '\0',126,229,36),(1255,_binary '\0',117,229,33),(1256,_binary '\0',115,229,33),(1257,_binary '\0',127,229,36),(1258,_binary '',128,229,36),(1259,_binary '\0',132,229,37),(1260,_binary '\0',134,229,38),(1261,_binary '',130,229,37),(1262,_binary '\0',129,229,36),(1263,_binary '',133,229,37),(1264,_binary '\0',131,229,37),(1265,_binary '\0',136,229,38),(1266,_binary '',135,229,38),(1267,_binary '\0',137,229,38),(1268,_binary '\0',111,230,32),(1269,_binary '\0',112,230,32),(1270,_binary '',110,230,32),(1271,_binary '\0',122,230,35),(1272,_binary '',123,230,35),(1273,_binary '\0',113,230,32),(1274,_binary '\0',125,230,35),(1275,_binary '\0',124,230,35),(1276,_binary '\0',118,230,34),(1277,_binary '',119,230,34),(1278,_binary '\0',120,230,34),(1279,_binary '\0',121,230,34),(1280,_binary '',114,230,33),(1281,_binary '\0',115,230,33),(1282,_binary '\0',116,230,33),(1283,_binary '\0',117,230,33),(1284,_binary '',126,230,36),(1285,_binary '\0',127,230,36),(1286,_binary '\0',128,230,36),(1287,_binary '\0',129,230,36),(1288,_binary '\0',130,230,37),(1289,_binary '\0',131,230,37),(1290,_binary '\0',132,230,37),(1291,_binary '',133,230,37),(1292,_binary '\0',134,230,38),(1293,_binary '\0',136,230,38),(1294,_binary '\0',137,230,38),(1295,_binary '',135,230,38),(1296,_binary '\0',136,231,38),(1297,_binary '\0',122,231,35),(1298,_binary '',125,231,35),(1299,_binary '\0',112,231,32),(1300,_binary '',123,231,35),(1301,_binary '\0',119,231,34),(1302,_binary '\0',113,231,32),(1303,_binary '\0',124,231,35),(1304,_binary '\0',118,231,34),(1305,_binary '\0',130,231,37),(1306,_binary '',110,231,32),(1307,_binary '\0',111,231,32),(1308,_binary '\0',134,231,38),(1309,_binary '\0',129,231,36),(1310,_binary '',128,231,36),(1311,_binary '\0',127,231,36),(1312,_binary '\0',117,231,33),(1313,_binary '\0',126,231,36),(1314,_binary '',115,231,33),(1315,_binary '\0',121,231,34),(1316,_binary '\0',132,231,37),(1317,_binary '\0',135,231,38),(1318,_binary '\0',137,231,38),(1319,_binary '\0',133,231,37),(1320,_binary '\0',114,231,33),(1321,_binary '\0',131,231,37),(1322,_binary '\0',116,231,33),(1323,_binary '',120,231,34),(1324,_binary '',110,234,32),(1325,_binary '\0',111,234,32),(1326,_binary '\0',122,234,35),(1327,_binary '\0',119,234,34),(1328,_binary '',123,234,35),(1329,_binary '\0',128,234,36),(1330,_binary '\0',113,234,32),(1331,_binary '\0',130,234,37),(1332,_binary '\0',135,234,38),(1333,_binary '\0',131,234,37),(1334,_binary '\0',134,234,38),(1335,_binary '',137,234,38),(1336,_binary '',132,234,37),(1337,_binary '\0',125,234,35),(1338,_binary '\0',115,234,33),(1339,_binary '',118,234,34),(1340,_binary '',116,234,33),(1341,_binary '\0',112,234,32),(1342,_binary '\0',124,234,35),(1343,_binary '\0',120,234,34),(1344,_binary '\0',127,234,36),(1345,_binary '\0',114,234,33),(1346,_binary '',121,234,34),(1347,_binary '',129,234,36),(1348,_binary '\0',117,234,33),(1349,_binary '\0',126,234,36),(1350,_binary '\0',136,234,38),(1351,_binary '\0',133,234,37),(1352,_binary '',123,241,35),(1353,_binary '\0',113,241,32),(1354,_binary '\0',122,241,35),(1355,_binary '\0',111,241,32),(1356,_binary '\0',112,241,32),(1357,_binary '',110,241,32),(1358,_binary '\0',124,241,35),(1359,_binary '',119,241,34),(1360,_binary '\0',125,241,35),(1361,_binary '\0',118,241,34),(1362,_binary '\0',121,241,34),(1363,_binary '\0',120,241,34),(1364,_binary '\0',114,241,33),(1365,_binary '\0',117,241,33),(1366,_binary '',116,241,33),(1367,_binary '\0',115,241,33),(1368,_binary '',126,241,36),(1369,_binary '\0',127,241,36),(1370,_binary '\0',128,241,36),(1371,_binary '\0',129,241,36),(1372,_binary '\0',130,241,37),(1373,_binary '\0',131,241,37),(1374,_binary '\0',133,241,37),(1375,_binary '',132,241,37),(1376,_binary '\0',134,241,38),(1377,_binary '\0',135,241,38),(1378,_binary '',136,241,38),(1379,_binary '\0',137,241,38);
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
  `label_test` varchar(500) NOT NULL,
  `created_at_test` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_test`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (18,_binary '\0','Test sur la santé','2024-05-18 10:09:00.982000');
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
  `description_topic` varchar(3000) DEFAULT NULL,
  `label_topic` varchar(500) NOT NULL,
  `created_at_topic` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_topic`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (1,_binary '\0','thème en rapport avec les math','Mathématique','2024-05-19 13:34:21.604000'),(2,_binary '\0',NULL,'Nourriture','2024-05-19 13:34:27.936000'),(5,_binary '\0','','On the fly','2024-05-19 13:34:27.936000'),(6,_binary '\0','Sujet lié à la cuisine : différents types de recettes, techniques de cuisine, ingrédients populaires, etc.','Cuisine','2024-05-19 15:49:47.000000'),(7,_binary '\0','Sujet lié à la programmation : langages de programmation, concepts de base, frameworks populaires, etc.','Programmation','2024-05-19 15:49:47.000000'),(8,_binary '\0','Sujet lié à la culture générale : histoire, géographie, littérature, arts, etc.','Culture générale','2024-05-19 15:49:47.000000'),(10,_binary '\0','Sujet lié à la santé et au bien-être : exercice physique, nutrition, gestion du stress, etc.','Santé et bien-être','2024-05-19 15:49:47.000000'),(11,_binary '\0','Sujet lié à la technologie : dernières tendances, innovations, gadgets, etc.','Technologie','2024-05-19 15:49:47.000000'),(12,_binary '\0','Thème sur les compétences générales : communication, résolution de problèmes, travail d\'équipe, etc.','Compétences générales','2024-05-19 16:25:17.259000');
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

-- Dump completed on 2024-05-29 20:33:53
