# Cozy Language Village

A mobile-first cozy life game where you learn a language by living in it. You move into a little village of
stuffed-animal neighbors and pick up English, Spanish, or Japanese through conversations, errands, fishing,
shopping, and decorating. There are no lessons.

This is the MVP: a polished, playable slice of the full gameplay loop.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open the printed URL on a phone (same Wi-Fi) or in a desktop browser. On desktop, use WASD or the arrow keys to walk.

```bash
npm run build:single
```

This writes `dist/cozy-language-village.html`, one self-contained file you can host anywhere or open directly.

Debug URL parameters: `?hour=21.5`, `?weather=rainy|snowy|cloudy|sunny`, `?season=spring|summer|autumn|winter`.

## What's in the MVP

| Spec item | Where it lives |
| --- | --- |
| Intro + language selection (all 6 directions, 3 levels, Japanese script choice) | `src/ui/onboarding.ts` |
| Explorable village: square, café, store, home, garden, pond, forest, villager homes | `src/world/village.ts`, `src/content/places.ts` |
| Three plush villagers (Biscuit the bear, Pip the bunny, Yuzu the capybara) with routines, expressions, voices | `src/world/plush.ts`, `src/world/actors.ts`, `src/content/characters.ts` |
| Conversations: phrase → meaning → audio → reply → gentle explanation | `src/ui/dialogue.ts`, `src/content/dialogues.ts` |
| Vocabulary tracking + spaced repetition | `src/learning/srs.ts`, `src/learning/engine.ts` |
| Three quests (Hello Neighbors, Tea for Yuzu, Pip's Lost Things) | `src/content/quests.ts`, `src/core/progress.ts` |
| Coins, XP and levels, friendship hearts, unlocks, achievements, outfits, pond journal | `src/core/progress.ts`, `src/ui/notebook.ts` |
| Customizable home (furniture placement, wallpaper, floor, room expansion) | `src/world/home.ts`, decorate mode in `src/game.ts` |
| Day/night from the real clock, daily weather, seasons and seasonal decorations | `src/world/env.ts` |
| Sound effects (UI, footsteps by surface, hops, fishing, doors, decorating, rewards) | `tools/sound/render.py` → `src/audio/assets/sfx.ts` |
| Villager voices: babble built from each line's real syllables, plus giggles, gasps, "hmm"s, yawns | `tools/sound/render.py` → `src/audio/assets/voice.ts`, `src/audio/samples.ts` |
| Generative music, ambience, pronunciation via speech synthesis | `src/audio/audio.ts`, `src/learning/tts.ts` |
| Persistent progress, cloud-ready storage adapter, save migration | `src/core/save.ts` |

### Learning activities

- **Quest conversations:** introductions, ordering at the café, understanding directions.
- **Daily small talk:** each villager chats once a day. You greet them for the right time of day, answer weather small talk, and they ask about words that are *due* for review. Story lines unlock as friendship grows.
- **Exercises, always in context:** choose a reply, build a sentence from tiles, name an object, pick what you heard, pick what a line meant.
- **Shopping:** you ask for items by name ("I'd like the ___, please"). Shop labels show names for new words and hide them once you know the word, which turns browsing into recall.
- **Fishing:** after a catch you name the fish. Correct names fill the pond journal, and Pip pays full price only for fish you can name.
- **Reading:** a daily notice on the plaza board with a comprehension question, and quest hints written in the target language.
- **Grammar "discoveries":** short notes appear the first time a structure shows up (は, を, か, katakana, el/la, me gusta, contractions…).

### Rewards are tied to learning

Coins from small talk are paid only for correct answers on words that are actually due for review, capped per day. Quests, fishing identification, and the notice board pay for comprehension. Repeating the same drill earns nothing extra.

### Japanese support

- Script mode: **kana only** (with word spacing, like children's books), **kanji with furigana**, or **kanji** (tap a line to peek at readings).
- Romaji is optional and off by default. It is generated from the kana readings, and particles are romanized correctly (は→wa, を→o, へ→e).
- Content uses a small ruby markup, `{漢字|かな}` with `^` marking particles, so one string drives every display mode, the romaji, and the word tiles.

## Sound

All effects and villager voices are designed in `tools/sound/render.py` (numpy only), using music-box and bell
synthesis, shaped noise, and formant-synthesized vowels. They're packed into two sprite banks embedded in the
build, so there are no network requests.

```bash
python3 tools/sound/render.py
```

- **Footsteps** change with the ground: grass, wooden dock and bridge, plaza stone, snow in winter, and wood floors indoors.
- **Villager babble** follows the vowels and consonants of the line being spoken (romaji for Japanese). Each villager plays the same syllable bank at their own pitch, so Pip squeaks, Biscuit is warm, and Yuzu rumbles.
- **Expression changes** trigger a small vocal reaction: giggle, gasp, hmm, yay, aww, yawn, or "hi!" when you walk up.
- **Replacing a sound:** to use recorded or commissioned audio, keep the sprite names and replace the bank. The game falls back to live synthesis for any missing name.
- **Pronunciation** still uses the device's speech voices. Pre-rendered neural voices would need a TTS model or API.
  Those hosts, such as huggingface.co, are blocked in the environment that built this.

## Architecture

```
src/
  content/     data only: languages, lexicon, phrases, characters, dialogues, quests, items, notes, places
  core/        save data + storage adapter, events, progression/rewards/quests, UI strings
  learning/    text rendering (ruby/romaji/tiles), spaced repetition, speech, learning engine
  world/       three.js: plush builder, village builder, sky/weather/particles, actors, home interior
  audio/       Web Audio synthesis (music, ambience, UI sounds, voice blips)
  ui/          DOM overlay: HUD, joystick, dialogue, notebook, shop, onboarding
  game.ts      orchestrates world, interactions, fishing, home, celebrations
```

- **Everything is procedural.** Characters, buildings, textures (fabric weave, stitches, signs) and sounds are generated at runtime, so there are no asset files.
- **Mobile performance:** static props are merged into a few vertex-colored meshes, so the whole village draws in about 50 calls. Shadow resolution drops on touch devices.
- **Content is data-driven.** Screens never hardcode language content.

### Adding a language

1. Register it in `src/content/languages.ts` (code, autonym, speech locales).
2. Add the new code to the `t` objects in `lexicon.ts`, `phrases.ts`, `characters.ts`, `quests.ts`, `dialogues.ts`, and `notes.ts`, and add UI strings in `core/i18n.ts`.
3. Learning progress is stored per `native>target` pair, so existing saves are unaffected.

Missing translations fall back to English, so you can add a language incrementally.

### Accounts and cloud saves

`core/save.ts` defines a `SaveAdapter` interface (`load`, `save`, `clear`). The game uses `LocalStorageAdapter` today. A cloud adapter can be swapped in with `store.setAdapter(...)` without touching gameplay code. Saves carry a `version` and go through `migrate()`.

## Library choices

- **three.js** renders the world.
- **cannon.js was not used.** The game only needs circle-vs-shape collision and walkable-water checks (`world/actors.ts`), and a physics engine would add weight without improving the feel.
- **Unity Physics** is a Unity DOTS package and can't run in a web build.

## Known limits / next steps

- Pronunciation uses the device's speech voices. Quality varies by device, and some phones may lack a voice for a language (the game shows a notice). Recorded voice lines would be the upgrade.
- Response evaluation is choice-based (replies, tiles, pictures). Typed answers and speech recognition are natural next steps.
- Content: 3 villagers, about 90 words, about 100 phrases. The data model is ready for more villagers, quests, and locations, such as the forest clearing that unlocks at level 2.
- Ideas: cooking with recipes, a weekly market, mail from villagers (reading practice), seasonal events, cloud sync and accounts.
