# CineTrack

CineTrack est une application Next.js 16 en `App Router` pour gerer une bibliotheque de films et series.

## Pre-requis

- Node.js `20.9+`
- `npm`

## Installation propre

Le projet utilise `package-lock.json`, donc l'installation la plus propre est :

```bash
npm ci
```

`npm ci` installe exactement les versions verrouillees dans le lockfile.

Si tu ajoutes ou modifies des dependances, utilise ensuite :

```bash
npm install <package>
```

## Lancer le projet

```bash
npm run dev
```

Ensuite ouvre :

```text
http://localhost:3000
```

## Commandes utiles

```bash
npm run build
npm run start
npm run lint
npm run lint:fix
```

- `build` genere une version de production
- `start` lance le serveur de production apres le build
- `lint` verifie le code
- `lint:fix` corrige automatiquement ce qui peut l'etre

## Nettoyage du depot

Les fichiers suivants ne servent pas au projet et peuvent etre supprimes ou ignores :

- `__MACOSX/`
- `.next/`
- `node_modules/`
- les SVG de demo Next.js dans `public/` s'ils ne sont pas utilises

Le depot est maintenant nettoye de ses assets de template inutiles. Il reste uniquement le favicon du projet et les fichiers necessaires au fonctionnement de l'application.

## Utilisation de l'IA

L'IA a ete utilisee sur ce projet de maniere importante pour gagner du temps et aller plus vite sur la realisation.

Concretement, elle m'a aide pour :

- ameliorer l'interface et la rendre plus propre visuellement
- faire des audits sur le cote UX / UI
- m'aider a verifier certains points avec des tests
- accelerer une grande partie de la production du code

Je precise cependant que j'avais deja une bonne base en React avant de commencer, et que je comprends le code produit. L'IA a servi de support pour aller plus vite et structurer le projet, pas pour remplacer la comprehension du travail realise.

## Structure

- `src/app/page.tsx` : page principale
- `src/app/layout.tsx` : layout global et polices
- `src/app/components/` : composants UI
- `src/app/data/` : donnees de depart
- `src/app/lib/` : logique metier et helpers
