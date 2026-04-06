# Heberger le jeu sur Render

Le projet fonctionne maintenant de deux facons sur **Render** :
- **Static Site**
- **Web Service Node.js** (recommande si tu as deja cree un service Render qui attend un `start`)

## Option 1 - Static Site

1. Cree un depot GitHub contenant tous les fichiers du projet.
2. Ouvre [Render](https://render.com/) puis clique sur **New +** > **Static Site**.
3. Connecte ton compte GitHub et selectionne le depot du quiz.
4. Renseigne la configuration suivante:
   - **Name**: `cap-sur-le-quiz`
   - **Build Command**: laisse vide ou `npm run render-build`
   - **Publish Directory**: `.`
5. Lance le deploiement.

## Option 2 - Web Service Node.js

Si ton service Render a deja ete cree comme application web, tu peux maintenant l'utiliser directement avec :

- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

Le fichier `server.js` sert automatiquement `index.html`, `installer.html`, `telecharger.html` et `downloads/latest.apk`.

## Resultat

Render te donnera une URL du type `https://ton-service.onrender.com/`.
Les pages `index.html`, `installer.html`, `telecharger.html` et `downloads/latest.apk` utiliseront alors ce meme domaine public.

## Commandes Git locales

Si tu veux le faire depuis le terminal dans le dossier du projet :

```powershell
git init
git branch -M main
git add .
git commit -m "Initial quiz site"
git remote add origin https://github.com/TON-COMPTE/NOM-DU-DEPOT.git
git push -u origin main
```

## Important

- Les comptes utilisateurs et les sauvegardes utilisent `localStorage`.
- La reprise de partie fonctionne sur le navigateur et l'appareil de l'utilisateur, pas entre plusieurs appareils.
- Pour une vraie synchronisation multi-appareils, il faudra ajouter un backend ou un service comme Firebase ou Supabase.
- Chaque nouveau `git push` sur la branche connectee a Render peut redeployer automatiquement le site.