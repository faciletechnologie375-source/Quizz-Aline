# Heberger le jeu sur GitHub Pages

Le projet est deja prepare pour GitHub Pages avec un workflow GitHub Actions.

## Fichiers utiles deja ajoutes

- `.github/workflows/deploy-pages.yml`
- `.nojekyll`

## Etapes

1. Cree un depot GitHub vide.
2. Envoie tous les fichiers du projet dans ce depot.
3. Assure-toi que la branche principale s'appelle `main`.
4. Ouvre le depot sur GitHub puis va dans `Settings` > `Pages`.
5. Dans `Build and deployment`, choisis `Source: GitHub Actions`.
6. Pousse le projet sur GitHub si ce n'est pas deja fait.
7. Ouvre l'onglet `Actions` du depot et attends la fin du workflow `Deploy to GitHub Pages`.
8. GitHub te donnera une URL du type `https://ton-compte.github.io/nom-du-depot/`.

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