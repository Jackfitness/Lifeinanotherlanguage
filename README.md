# Cozy Language Village

A mobile-first cozy life game where you learn Japanese by living in it. You move into a little village of
stuffed-animal neighbors and pick up Japanese (from English or Spanish) through conversations, errands, fishing,
shopping, and decorating. Five Village Pass towns, one per JLPT level from N5 to N1, add a story, a dojo and an exam each.

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
- **Pronunciation** uses pre-rendered neural voices (Kokoro-82M, Apache-2.0) for every word and phrase, in all three
  languages, at normal and slow speeds (`public/voice/`). The game loads only the target language. Lines that
  include the player's name fall back to the device voice. To regenerate, see `tools/voice/render_tts.py`.

## Free play, pricing and the Village Pass

**Free:** the starter village (15 minutes a day, reset at local midnight) plus **chapter 1 of Clover Meadow (N5)** as a taste of the story, dojo and lessons. The Pass offer appears right after that chapter ends ("The story continues…"), when a locked chapter or lesson is tapped, at bedtime, and from the map.

**Village Pass** (`src/core/billing.ts`, `src/ui/pass.ts`): unlimited daily play and every town, N5 to N1.

| Plan | Product id | Price (USD) |
| --- | --- | --- |
| Lifetime (featured) | `village_pass_lifetime` | $19.99 one-time |
| Monthly | `village_pass_monthly` | $3.99/month, 7-day free trial |

Change prices in the stores (and `PRICING` in `billing.ts` for the web test mode). Change the free taste with `FREE_PREVIEW`.

**Payments:**
- **Web build / artifact:** test mode. Purchases are simulated and the sheet says "Test mode: no real money is charged". `?pass=1` still forces the Pass on.
- **iOS / Android:** real payments through RevenueCat, which handles both stores, receipts, trials, renewals and refunds. See **Phone apps** below.

## The towns (N5 → N1)

| Town | Level | Villagers | Story |
| --- | --- | --- | --- |
| Clover Meadow | N5 | ducks, frogs | The Clover Bell: the old bell won't ring before the spring festival |
| Maple Harbor | N4 | penguins, otters | The Harbor Light: the lighthouse goes dark before the first summer ferry |
| Lantern Hills | N3 | foxes, raccoons | The Thousand Lights: lanterns vanish before the lantern festival |
| Snowcap Peaks | N2 | owls, deer | The Year-End Bell: a cracked belfry, a village debate and a blizzard |
| Starlight City | N1 | cats, dogs | Curtain Call: a century-old theater's final season |

Each town has 9 story chapters, 6 villagers, about 110–180 words, 24–28 grammar points and 8 reading passages, which comes to roughly 2–3 hours of play.

- **Dojo:** 8 lessons (one per chapter, unlocked by the story; 60% to pass), six practice modes, and belts from white to black.
- **Exam:** 30 questions across vocabulary, kanji, grammar, reading and listening. 80% passes, and the last chapter's finale (ringing the town bell) follows.
- **Layout:** every town shares one street plan (`world/towns/build.ts`) with its own theme: ground, landmark, buildings, water, edges and props.
- **Adding a town:** create `src/content/towns/<id>/` (vocab, grammar, reading, story, index), add it to `TOWNS` in `src/content/towns/index.ts`, add a theme in `world/towns/build.ts`, then run `npm run validate:towns` (checks kanji readings and every word, phrase, item, villager and quest reference).
- **Voices:** `npm run voice:lines` exports one pack per town; `tools/voice/render_tts.py` renders them with Kokoro. The base pack is always loaded, and town packs load only while you're there.

## Phone apps (iOS and Android)

The game ships as native apps with [Capacitor](https://capacitorjs.com): the same web build runs inside `android/` and `ios/` projects that are already set up (portrait only, app icon and splash screen, Android back button, RevenueCat payments).

**Builds without installing anything:** every push to `main` runs **Android build** in GitHub Actions. Open the run, download `cozy-language-village-debug-apk` from Artifacts, and install it on an Android phone for testing. **iOS build & TestFlight upload** (run by hand from the Actions tab) compiles the iPhone app, and uploads it to TestFlight once the App Store Connect secrets are set.

**On your own computer:**

```bash
npm run app:android
```

```bash
npm run app:ios
```

These build the game, copy it into the native projects and open Android Studio or Xcode (Mac only).

**Before the first store upload:**
1. Pick the final app id in `capacitor.config.ts` (now `com.lifeinanotherlanguage.app`). It can't change after release.
2. Payments: create `village_pass_lifetime` (non-consumable) and `village_pass_monthly` (auto-renewing, 7-day free trial) in App Store Connect and Google Play Console. In RevenueCat, attach both to an entitlement called `village_pass` in the current offering, then add the public SDK keys as repository secrets `REVENUECAT_ANDROID_KEY` and `REVENUECAT_IOS_KEY` (or as `VITE_REVENUECAT_ANDROID_KEY` / `VITE_REVENUECAT_IOS_KEY` for local builds). Without a key the app runs purchases in test mode.
3. Android release: create an upload keystore once, then add the `ANDROID_KEYSTORE_*` secrets listed at the top of `.github/workflows/android.yml`. The workflow then also produces a signed `.aab` for Google Play.
4. iOS release, no Mac needed: create an App Store Connect API key with **Admin** access (Users and Access → Integrations → App Store Connect API → Team Keys) and add `APPSTORE_KEY_ID`, `APPSTORE_ISSUER_ID` and `APPSTORE_KEY_P8` (the whole `.p8` file) as repository secrets. Then run **iOS build & TestFlight upload** from the Actions tab: GitHub's Macs sign the app with Apple's cloud-managed certificates and upload it to TestFlight. Each run gets a new build number automatically. With a Mac you can also use Xcode: Product → Archive.
5. New icon or splash art: replace the PNGs in `assets/` and run `npm run app:assets`.

## Icons

All icons are custom SVGs in `src/ui/icons.ts`, in one consistent style; no emoji are used. Interface emoji in the code are swapped for icons automatically when rendered.

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

### Adding a menu language

The game only teaches Japanese. Menus, hints and translations are shown in the player's own language (English or Spanish today).

1. Add the code to `NATIVE_LANGS` in `src/content/languages.ts`.
2. Add it to the `t` objects in the content files (`lexicon.ts`, `phrases.ts`, `characters.ts`, `quests.ts`, `dialogues.ts`, `notes.ts`, `content/towns/*`) and to the UI strings in `core/i18n.ts`.

Missing translations fall back to English, so you can add one incrementally.

### Accounts and cloud saves

`core/save.ts` defines a `SaveAdapter` interface (`load`, `save`, `clear`). The game uses `LocalStorageAdapter` today. A cloud adapter can be swapped in with `store.setAdapter(...)` without touching gameplay code. Saves carry a `version` and go through `migrate()`.

## Library choices

- **three.js** renders the world.
- **cannon.js was not used.** The game only needs circle-vs-shape collision and walkable-water checks (`world/actors.ts`), and a physics engine would add weight without improving the feel.
- **Unity Physics** is a Unity DOTS package and can't run in a web build.

## Known limits / next steps

- Pronunciation uses pre-rendered neural voice packs (Kokoro), with the device voice as a fallback for lines that include the player's name.
- Response evaluation is choice-based (replies, tiles, pictures). Typed answers and speech recognition are natural next steps.
- Content: each town is about 2–3 hours. More chapters per town (toward 3–5 hours) are planned.
- Ideas: cooking with recipes, a weekly market, mail from villagers (reading practice), seasonal events, cloud sync and accounts.
