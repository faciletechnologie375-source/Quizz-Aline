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

## Hebergement

Le projet est publie sur GitHub Pages depuis la branche `main`. Chaque `git push` sur `main` redeploie le site automatiquement. Voir `DEPLOY.md`.

## Fichiers

- `index.html` : structure des ecrans.
- `styles.css` : direction visuelle geographie / voyage.
- `data.js` : base de questions.
- `app.js` : logique du jeu.