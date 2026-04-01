# Cap sur le Quiz

Jeu de quiz front-end sur les pays, capitales et monuments, jouable directement dans le navigateur.

## Contenu

- Comptes locaux avec nom d'utilisateur, mot de passe et reprise de partie sur le meme navigateur.
- Ecran d'accueil avec choix du niveau, du continent, du parcours et du mode.
- Partie interactive avec choix multiples, mini-carte cliquable, score en temps reel, indice et feedback immediat.
- Modes standard, apprentissage, defi 10 pays en 1 minute et duel contre un bot.
- Ecran de resultat avec recapitulatif des reponses et partage du score.

## Lancer le projet

Ouvre `index.html` dans un navigateur moderne.

Les comptes et sauvegardes sont stockes localement dans le navigateur via `localStorage`.

## Hebergement

Le projet est publie sur GitHub Pages depuis la branche `main`. Chaque `git push` sur `main` redeploie le site automatiquement. Voir `DEPLOY.md`.

## Fichiers

- `index.html` : structure des ecrans.
- `styles.css` : direction visuelle geographie / voyage.
- `data.js` : base de questions.
- `app.js` : logique du jeu.