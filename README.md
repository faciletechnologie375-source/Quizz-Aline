# Cap sur le Quiz

Jeu de quiz front-end sur les pays, capitales et monuments, jouable directement dans le navigateur.

## Contenu

- Comptes locaux avec nom d'utilisateur, mot de passe et reprise de partie sur le meme navigateur.
- Classement partage en ligne optionnel (multi-appareils) via Supabase.
- Ecran d'accueil avec choix du niveau, du continent, du parcours et du mode.
- Partie interactive avec choix multiples, mini-carte cliquable, drapeaux visuels, score en temps reel, indice et feedback immediat.
- Modes standard, apprentissage, defi 10 pays en 1 minute et duel contre un bot.
- Base enrichie avec un plus grand nombre de pays, capitales et monuments.
- Classement local des joueurs et historique des sessions par compte.
- Ecran de resultat avec recapitulatif des reponses et partage du score.

## Lancer le projet

Ouvre `index.html` dans un navigateur moderne.

Les comptes et sauvegardes sont stockes localement dans le navigateur via `localStorage`.

## Classement partage entre appareils (optionnel)

Par defaut, le jeu reste 100% local. Pour voir les scores des autres appareils en temps reel, active la synchro en ligne:

1. Cree un projet Supabase.
2. Execute ce SQL dans Supabase SQL Editor:

```sql
create table if not exists public.quiz_leaderboard (
	username text primary key,
	display_name text not null,
	best_score integer not null default 0,
	updated_at timestamptz not null default now()
);

alter table public.quiz_leaderboard enable row level security;

create policy "Public read leaderboard"
on public.quiz_leaderboard
for select
to anon
using (true);

create policy "Public upsert leaderboard"
on public.quiz_leaderboard
for insert
to anon
with check (true);

create policy "Public update leaderboard"
on public.quiz_leaderboard
for update
to anon
using (true)
with check (true);
```

3. Ouvre `online-config.js` et renseigne:
	 - `enabled: true`
	 - `serviceUrl` (URL du projet Supabase)
	 - `anonKey` (cle publique anon)

Une fois active, chaque joueur publie son meilleur score et voit les scores des autres joueurs (tri du meilleur au pire).

### Comptes multi-appareils (meme identifiant sur plusieurs appareils)

Ajoute aussi cette table pour synchroniser les comptes (nom, mot de passe hash, progression):

```sql
create table if not exists public.quiz_accounts (
	username text primary key,
	display_name text not null,
	password_hash text not null,
	best_score integer not null default 0,
	best_challenge integer not null default 0,
	best_by_mode jsonb not null default '{}'::jsonb,
	history jsonb not null default '[]'::jsonb,
	saved_game jsonb,
	updated_at timestamptz not null default now()
);

alter table public.quiz_accounts enable row level security;

create policy "Public read accounts"
on public.quiz_accounts
for select
to anon
using (true);

create policy "Public upsert accounts"
on public.quiz_accounts
for insert
to anon
with check (true);

create policy "Public update accounts"
on public.quiz_accounts
for update
to anon
using (true)
with check (true);
```

## Hebergement

Le projet est publie sur GitHub Pages depuis la branche `main`. Chaque `git push` sur `main` redeploie le site automatiquement. Voir `DEPLOY.md`.

## Distribution par lien direct (sans Play Store)

L'application Android peut etre telechargee gratuitement via un lien direct.

- Page ultra simple (1 bouton): `https://faciletechnologie375-source.github.io/Quizz-Aline/installer.html`
- Page de telechargement: `https://faciletechnologie375-source.github.io/Quizz-Aline/telecharger.html`
- Lien direct APK: `https://faciletechnologie375-source.github.io/Quizz-Aline/downloads/latest.apk`

### Mettre a jour l'APK telechargeable

1. Genere un nouvel APK release:

```bash
npm run mobile:build:release
```

2. Remplace les fichiers dans `downloads/`:

- `downloads/cap-sur-le-quiz-release-vX.Y.apk`
- `downloads/latest.apk` (toujours la derniere version)

3. Fais un commit puis un push sur `main`.

Une fois GitHub Pages redeploye, le meme lien `downloads/latest.apk` distribuera automatiquement la nouvelle version.

## Application mobile (Android)

Le projet est maintenant prepare avec Capacitor pour Android.

### Prerequis

- Node.js installe
- Android Studio installe
- SDK Android configure dans Android Studio

### Commandes utiles

```bash
npm install
npm run mobile:doctor
npm run mobile:sync
npm run mobile:open:android
npm run mobile:build:debug
npm run mobile:build:release
npm run mobile:build:bundle
```

Explication rapide:

- `mobile:sync` copie les fichiers web vers `www/` puis synchronise le projet Android.
- `mobile:open:android` ouvre directement le projet natif dans Android Studio.
- `mobile:doctor` verifie la presence de Java, keytool et Android Studio.
- `mobile:build:debug` genere un APK debug.
- `mobile:build:release` genere un APK release.
- `mobile:build:bundle` genere un Android App Bundle (`.aab`) pour le Play Store.

### Signature Android release

Pour une vraie publication Play Store, il faut un keystore de signature.

1. Cree le keystore:

```bash
npm run mobile:keystore
```

2. Copie `keystore.properties.example` vers `keystore.properties`
3. Renseigne les vraies valeurs:

```properties
storeFile=../../android-release.keystore
storePassword=VOTRE_MOT_DE_PASSE
keyAlias=capquiz
keyPassword=VOTRE_MOT_DE_PASSE
```

4. Lance ensuite:

```bash
npm run mobile:build:release
```

Sans `keystore.properties`, le build release reste possible pour test local, mais il n'est pas pret pour une publication Play Store.

### Generer l'APK

1. Lance `npm run mobile:open:android`
2. Dans Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
3. Recupere l'APK genere depuis Android Studio

### Publier sur Google Play (checklist complete)

1. Genere le bundle de publication:

```bash
npm run mobile:build:bundle
```

2. Verifie le fichier genere:

- `android/app/build/outputs/bundle/release/app-release.aab`

3. Ouvre Google Play Console, cree l'application (si premiere publication), puis configure:

- Nom de l'application
- Langue par defaut
- Type d'application (Jeux)
- Statut payant/gratuit

4. Complete la fiche Play Store:

- Description courte (max 80 caracteres)
- Description complete
- Captures d'ecran smartphone (obligatoire)
- Icône 512x512
- Image feature graphic 1024x500
- Categorie (Quiz / Education)
- Coordonnees de contact
- Politique de confidentialite (URL)

5. Remplis les formulaires de conformite:

- Securite des donnees (Data safety)
- Acces a l'application (si necessaire)
- Classification de contenu
- Public cible et contenu
- Publicite (oui/non)

6. Cree une release:

- Production > Creer une nouvelle version
- Uploader `app-release.aab`
- Ajouter les notes de version
- Sauvegarder

7. Verifications avant envoi:

- Tester l'APK release sur un vrai appareil
- Verifier connexion compte + synchro Supabase
- Verifier permissions, ecran de lancement, navigation
- Verifier qu'aucune cle sensible n'est exposee dans les descriptions/store listing

8. Envoyer pour revision Google:

- Examiner et publier
- Attendre la validation (quelques heures a quelques jours)

### Publier une mise a jour

Avant chaque nouvelle publication, incrementer:

- `versionCode` (doit toujours augmenter)
- `versionName` (ex: 1.0 -> 1.1)

Ces champs sont dans `android/app/build.gradle`.

Puis:

```bash
npm run mobile:build:bundle
```

Uploader ensuite le nouveau `.aab` dans la release Play Console.

## Fichiers

- `index.html` : structure des ecrans.
- `styles.css` : direction visuelle geographie / voyage.
- `data.js` : base de questions.
- `app.js` : logique du jeu.