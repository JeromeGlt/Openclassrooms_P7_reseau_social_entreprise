Afin d'utiliser le site web, il suffit de créer un fichier .env dans le dossier "backend" dans lequel il y aura quatre variables d'environnement :

DB, assignée au nom de la base de donnée

DB_LOGIN, assignée à l'utilisateur de la base de donnée

DB_PASSWORD, assignée au mot de passe de l'utilisateur de la base de donnée

TOKEN, assignée à une chaîne secrète de développement pour encoder le token, comme par exemple "RANDOM_TOKEN_SECRET"

Il faut également créer un dossier "images" dans le dossier "backend".

-----------------------------------------------------------------

Voici les informations concernant l'utilisateur administrateur que je vous ai créé, à entrer dans le login :

Pseudo de l'administrateur : admin
Mot de passe de l'administrateur : Azertyu1

-----------------------------------------------------------------

Pour démarrer le backend, il suffit d'entrer la commande "nodemon server". Pour le frontend, "npm run serve".