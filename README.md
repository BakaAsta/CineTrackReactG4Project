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

## Structure

- `src/app/page.tsx` : page principale
- `src/app/layout.tsx` : layout global et polices
- `src/app/components/` : composants UI
- `src/app/data/` : donnees de depart
- `src/app/lib/` : logique metier et helpers

