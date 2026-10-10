# Woordjes

## Woordenlijst-formaat

Elke lijst is een JSON-bestand in `src/lib/data/`. Elke lijst verschijnt automatisch
op het startscherm, één keer zoals hij is en één keer andersom.

```json
{
	"id": "een-unieke-uuid",
	"name": "Teske Engels - 13 Oktober",
	"for": "Teske",
	"date": "2026-10-13",
	"labels": { "word": "Engels", "translation": "Nederlands" },
	"words": [
		{ "word": "colour", "translation": "kleur" },
		{ "word": "messy", "translation": ["slordig", "rommelig"] },
		{ "word": "awkward", "translation": "ongemakkelijk", "extra": true }
	],
	"sentences": [{ "word": "I spilled my drink.", "translation": "Ik morste mijn drinken." }]
}
```

- `word` / `translation`: een tekst, of een lijst met alternatieven die allemaal goed zijn.
  Op het scherm worden alternatieven met een komma getoond.
- `extra` (optioneel): extra moeilijk woord (blauw in het boek). Hoeft niet geleerd te worden
  en wordt voorlopig niet overhoord.
- `sentences` (optioneel): zinnen, hetzelfde formaat als `words`. Komen als aparte lijst
  ("… zinnen") op het startscherm.

## sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
