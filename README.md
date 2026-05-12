# Event Participation App

Un frontend pour gérer la participation à des évenements.

## Front Stack

- React, TypeScript, TailwindCSS et Vite
- Utilisation de React Query pour fetch et cache les data, aussi utilisation du refetchOnWindowFocus
- Utilisation de React Router pour avoir plusieurs pages

## Setup

1. Installation:

```bash
npm install
```

2. Run en dev:

```bash
npm run dev
```

3. Build pour prod (compilation par vite):

```bash
npm run build
```

## Infos à savoir

L'API ne fonctionne pas pour DELETE des participants.

L'UI est minimaliste, la creation des participants pourrait se faire sur une autre page mais sans gestion des participants de maniere globale (systeme de compte utilisateurs) ce n'est pas utile je pense.
