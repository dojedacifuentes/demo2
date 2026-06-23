# LEX QUEST

Legal RPG Prototype built from the public [Monster Tamer](https://github.com/devshareacademy/monster-tamer) Phaser project.

This version is intentionally a playable RPG base first: title screen, top-down movement, explorable map, collisions, NPC/event hooks, dialog UI, inventory/party menus, encounters, and turn-based monster battle systems. Legal content is limited to placeholders for this milestone.

## Why Monster Tamer

I compared these candidates:

- `devshareacademy/monster-tamer`: best gameplay base. Phaser 3, Tiled maps, world scene, NPCs, dialog scene, cutscenes/events, inventory, party, encounters, and a substantial battle scene.
- `jvnm-dev/pokemon-react-phaser`: React + TypeScript + Vite and GridEngine are attractive, but scripts are Bun-based and it leans heavily on Pokemon assets.
- `blopa/top-down-react-phaser-game-template`: useful React UI template with dialog and virtual gamepad, but it is closer to a template than a Pokemon-like RPG and has no real battle loop.
- `remarkablegames/phaser-rpg`: clean TypeScript + Vite template, but much lighter in gameplay systems.

Monster Tamer was chosen because the immediate goal is a functioning Pokemon-like game, not a fresh architecture exercise.

## Available Systems

- Motor: Phaser 3.
- Build: Vite, added for npm/Vercel compatibility.
- Scenes: preload, title, world, battle, dialog, cutscene, inventory, options, monster party, monster details.
- Movement: grid-based character movement in `src/world/characters`.
- Maps: Tiled JSON data in `public/assets/data`, rendered map assets in `public/assets/images`.
- Collisions: Tiled collision layer plus character/item collision checks.
- NPCs: data-driven NPC loading and movement paths.
- Dialog: queued modal dialog scene.
- Combat: turn-based monster battle scene with attacks, health, experience, capture flow, trainer battle support, and switch/flee/item options.
- Assets: local images, audio, fonts, and JSON data served from `public/assets`.
- Vercel: deploys as a Vite static build from `dist`.

## Missing Or Future Systems

- Legal NPC roles and case metadata.
- Branching legal dialog.
- Quest journal.
- Evidence inventory taxonomy.
- Lex City custom maps.
- Legal argument battle vocabulary.
- Case/story progression UI.

See `docs/LEX_QUEST_ARCHITECTURE.md` for the recommended integration path.

## Requirements

- Node.js 20+ recommended.
- npm.

PowerShell may block `npm.ps1` on some Windows systems. If that happens, use `npm.cmd` instead of `npm`.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL printed by Vite.

Controls:

- Arrow keys: move / navigate menus.
- Space: confirm / interact.
- Enter: open world menu.
- Shift: cancel/back in battle menus.

## Build

```bash
npm run build
```

The production output is generated in `dist`.

## Deploy To Vercel

1. Push this folder to a GitHub repository named `lex-quest-rpg`.
2. Import the repository in Vercel.
3. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

The included `vercel.json` already declares the build and output settings.

## Push To GitHub

```bash
git init
git add .
git commit -m "Initial LEX QUEST RPG prototype"
git branch -M main
git remote add origin https://github.com/<your-user>/lex-quest-rpg.git
git push -u origin main
```

## Credits

Base game code: Monster Tamer by Dev Share Academy, MIT license.

The original Monster Tamer credits and asset sources are retained in `LICENSE` and the source data. Review third-party asset terms before commercial use.
