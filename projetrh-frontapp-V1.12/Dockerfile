FROM node:latest

RUN npm install -g @angular/cli

WORKDIR /app

ENV APP_NAME 'my-app'
ENV ROUTING 'true'
ENV STANDALONE 'false'
ENV STRICT 'true'
ENV STYLE 'scss'

# Créer un nouveau projet Angular
RUN ng new $APP_NAME --routing=$ROUTING --standalone=$STANDALONE --strict=$STRICT --style=$STYLE

# Définir le répertoire de travail
WORKDIR /app/$APP_NAME

# Copier les fichiers de l'application dans le répertoire de travail
COPY . .

# Exposer le port 4200
EXPOSE 4200

# Démarrer le serveur Angular
CMD ng serve --host 0.0.0.0 --port 4200
