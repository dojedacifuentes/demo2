# LEX QUEST Future Architecture

This first milestone keeps the Monster Tamer gameplay base stable. Future legal RPG work should extend the existing data-driven systems instead of replacing the game loop.

## Current Extension Points

- NPCs: `public/assets/data/npcs.json`, `public/assets/data/events.json`, and Tiled `NPC` object layers.
- Dialog: `src/scenes/dialog-scene.js` already supports queued messages.
- Quests and cutscenes: `src/scenes/world-scene.js` already processes event zones and NPC event chains.
- Inventory: `src/scenes/inventory-scene.js` and `public/assets/data/items.json`.
- Battles: `src/scenes/battle-scene.js`, `public/assets/data/monsters.json`, and `public/assets/data/attacks.json`.
- Maps: Tiled JSON files in `public/assets/data`, with rendered map image assets under `public/assets/images/monster-tamer/map`.

## Proposed Legal RPG Layers

- Legal NPC profiles: add lawyer, judge, clerk, client, and witness metadata to NPC data.
- Branching dialog: introduce dialog node IDs and conditions while preserving the current dialog scene.
- Case quests: model cases as quest state, tied to event zones and NPC interactions.
- Evidence inventory: extend items with evidence category, source, relevance, and admissibility flags.
- Lex City maps: add new Tiled maps and assets gradually; keep collision, encounter, and scene transition conventions.
- Argument battles: reuse the battle state machine, replacing monsters/attacks with arguments, objections, and legal skills.
- Story flags: store case progress in the existing data manager before adding a heavier quest engine.

## Guardrails

- Keep movement, collision, scene transitions, and battle flow working at every step.
- Prefer data changes before engine changes.
- Add one legal system at a time and verify `npm run build` before continuing.
