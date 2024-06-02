#  PROJET RH V3


## A) Description
Le PROJET RH permet à un gestionnaire des ressources humaines de créer, modifier, consulter ou supprimer des questions, des questionnaires, des thèmes et des tests. Elle lui offre également la possibilité d’assigner ces tests à des candidats et d’en consulter les résultats. Ceux-ci peuvent ensuite passer les tests qui leur sont assignés, facilitant ainsi le processus de sélection et d'évaluation. 


## B) Langages et technologies utilisés
- Cette application a été développée à l’aide des langages suivants : HTML, SCSS, JavaScript, SQL, et Java.
- Concernant les technologies et l'architecture, j'ai employé Docker, des JWT*, Kafka, Angular, ainsi qu'une architecture micro-services. 


## C) Contexte du développement
Ce projet a débuté lors de mon premier stage, durant lequel l'idée initiale a été proposée par mon maître de stage, jouant le rôle de client. Au cours de mon deuxième stage, j'ai apporté des modifications à l'architecture de l'application. C'est à sa clôture que j'ai choisi de poursuivre ce travail pour en faire mon projet de fin d'études. Ce choix visait à approfondir son développement et à gagner du temps, étant donné que les fondations étaient déjà établies. J'ai alors commencé à concevoir une troisième version de l'application, axée sur des améliorations significatives du front-end. Il convient de noter que ce projet a été initié dans un cadre strictement éducatif.


## D) Déploiement en local
    1. Installer Docker.

    2. Ouvrir le fichier docker-compose.yml et commenter les lignes ci-dessous.
    ___ ___ ____ ___ ___ ____ ___ ___ ____
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.projetrh.rule=Host(`projetrh.tjhannart.dev`)"
      - "traefik.http.routers.projetrh.entrypoints=websecure"
      - "traefik.http.routers.projetrh.tls=true"
      - "traefik.http.routers.projetrh.tls.certresolver=letsencryptresolver"
      - "traefik.http.services.projetrh.loadbalancer.server.port=$FRONT_DOCKER_PORT"
      - "traefik.docker.network=traefik-network"
    ___ ___ ____ ___ ___ ____ ___ ___ ____
    traefik-network:
        external: true
    ___ ___ ____ ___ ___ ____ ___ ___ ____
    - traefik-network

    3. Vérifier que tout les ports mentionnés dans le fichier ".env" sont libres.

    4. Ouvrir une interface de commande et se placer à la racine du projet.
    
    5. Exécuter la commande "docker-compose up -d


## E) Connexion à l'application
- Comptes "HR Manager" :
  -	Compte n°1
    - Mail : laurentphilippe@gmail.com
    - Mot de passe : Philippe
  - Compte n°2
    - Mail : fakehr2@gmail.com
    - Mot de passe : philippe
- Comptes "Candidate" :
  - Compte n°1
    - Mail : boblebrun@gmail.com
    - Mot de passe : bob
  - Compte n°2
    - Mail : sophie.martin@example.com
    - Mot de passe : sophie
  - Compte n°3
    - Mail : emma.simon@example.com
    - Mot de passe : emma