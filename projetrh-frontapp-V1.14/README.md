# projetrh-frontapp-V1.14

## Objectif(s)
    A. Corriger les problèmes d'interface
    B. Importer le projet sur Docker (VPS) une nouvelle fois


### Réussi(s) ?
    A. Fait
    B. En cours (20/05/2024)


## Project settings :
    - pour autoriser les requêtes avec l'API, créer le fichier src/proxy.conf.json
      {
      "/aubay-HRProject/**": {
      //    "target": "http://localhost:1001",
      "target": "http://195.35.28.240:2001",
      "secure": false,
      "changeOrigin": true
      }
      }
    - puis modifier angular.json en rajoutant après ""serve": { "builder": "@angular-devkit/build-angular:dev-server"," :
      "options": {
            "browserTarget": "projetrh-frontapp-V1.7:build",
            "proxyConfig": "src/proxy.conf.json"
          },


## Libraries :
    - ng add @angular/material
    - npm install @auth0/angular-jwt
    - npm install @ngx-translate/core --save
    - npm install @ngx-translate/http-loader --save
    - npm install chart.js


## To create next project version :
    - ng new projetrh-frontapp-V1.14 --standalone false
        -> Which stylesheet format would you like to use? SCSS
        -> Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? Yes


## Components creation :
ng g c components/auth
& ng g c components/header
& ng g c components/questionnaires
& ng g c components/questionnaires/questionnaire-detail
& ng g c components/questionnaires/questionnaire-list
& ng g c components/questions
& ng g c components/questions/question-add
& ng g c components/questions/question-detail
& ng g c components/questions/question-list
& ng g c components/questions/question-list/question-item
& ng g c components/topics
& ng g c components/topics/topic-detail
& ng g c components/topics/topic-list
& ng g c components/tests
