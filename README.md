# Mission Control

An offline game-master companion for **Deep Rock Galactic: The Board Game (2nd edition)**, built for an iPad lying next to the board.

It keeps track of what the box doesn't: a mission clock you can pause, resume and stop; each player's kills, downs, revives and minerals with a live KDA; our swarm-overflow house rule; a quick rules reference; and a log of every mission you've played.

Fan-made and unofficial. Not affiliated with Ghost Ship Games or MOOD Publishing. The app contains no rulebook text or game art: the rules reference is a set of short paraphrases.

---

## Features

| Screen | What it does |
| --- | --- |
| **Main menu** | Start a new mission, continue the one in progress, browse the mission log, export/import saves, open the rules. |
| **New mission** | Name the mission, pick the type and hazard level (1–5), choose who's playing and enter player names (remembered for next time). |
| **Mission control** | Mission clock (Start / Pause / Resume / Stop), swarm overflow counter, one card per dwarf with +/− counters for Kills, Downed, Revives, Minerals and a live KDA, team totals, and a slide-in rules drawer with thumb-index tabs. Keeps the screen awake while the clock runs. |
| **Stop** | Pauses the clock and asks for the outcome: *Mission complete*, *Modest success* or *Mission failed*. Saves the run to the log, or discards it (with undo). |
| **Debrief** | The saved run: outcome stamp, type, hazard, time, overflows, per-dwarf stat table, team totals and MVP. Delete from the log (with undo). |
| **Rules** | Searchable quick reference: turn, actions, swarm, creatures (stat table), health & conditions, hazard, extraction, Deep Dive, house rules. |

**KDA** = (kills + revives) ÷ downed, with downed counted as at least 1. Revives are the "assists".
**MVP** = highest KDA, ties broken by kills, then minerals.

### House rule: swarm overflow

Reaching the end of the swarm track doesn't end the mission. The marker restarts, you tap **Swarm meter maxed**, and from then on "+1 swarm" events count double, doubling again with each overflow: +1 → +2 → +4 → +8. Mission Control always shows the current value.

To make it grow linearly instead (+1, +2, +3, +4), edit `swarmMultiplier()` in `src/app/core/mission/mission-math.ts`: replace `return 2 ** Math.max(0, overflows);` with `return Math.max(0, overflows) + 1;` and update the test in `mission-math.spec.ts`.

---

## Getting started

Requirements: **Node 22+** and npm.

```bash
npm install
npm start            # dev server on http://localhost:4200 (also reachable from the iPad on your Wi-Fi)
npm test             # unit tests (Vitest)
npm run build        # production build in dist/drg-mission-control/browser
npm run preview      # production build served on http://localhost:8080 (service worker active)
```

The service worker (offline support) only runs in production builds, so use `npm run preview` to test offline behaviour on your computer.

---

## Putting it on the iPad (offline)

Offline web apps need to be served once over HTTPS. The free route is GitHub Pages; this repo already contains the workflow.

1. Push the repo to GitHub (branch `main`).
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The *Deploy to GitHub Pages* workflow runs on every push to `main` (tests, build, publish). The site appears at `https://<your-user>.github.io/<repo-name>/`.
4. On the iPad, open that address in **Safari**, tap **Share → Add to Home Screen**.
5. Open it once from the new icon while online. After that it works with no connection.

Good to know:

- **Saves live on the iPad**, in the browser storage of the Home Screen app. Apps added to the Home Screen keep their storage; a site you only visit in a Safari tab may lose it after weeks of not being opened. Use the Home Screen app.
- **Back up or move saves** with the download/upload buttons on the *Mission log* header (a `.json` file you can keep in Files or AirDrop to another device). Importing merges and skips runs you already have.
- **Updates**: after you push a new version, open the app while online; it downloads the update in the background and uses it on the next launch.
- Each device has its own saves. There's no sync between devices (yet; see roadmap).

---

## Project structure

```
src/
  index.html                      iOS web-app meta tags, manifest, icons
  styles.scss                     Material theme mapped onto paper/ink, global base
  styles/
    _tokens.scss                  design tokens: colours, fonts, radius, safe areas
    _field-manual.scss            shared look: .fm-page, .fm-band, .fm-stripes, .fm-stamp, .fm-numeral, buttons
  app/
    app.config.ts                 hash routing, service worker, Material defaults
    app.routes.ts                 '' menu, 'mission', 'runs/:id', 'rules'
    core/
      models/mission.models.ts    all types: DwarfClass, Miner, ActiveMission, SavedRun, outcomes…
      mission/
        mission-math.ts           pure functions: swarmMultiplier, KDA, MVP, totals, durations
        mission-math.spec.ts      unit tests
        active-mission.store.ts   signal store for the mission being played (timer, swarm, stats)
      runs/runs.store.ts          signal store for the mission log, export/import
      storage/local-store.ts      localStorage helpers and versioned keys
      rules/rules.data.ts         the rules reference content (edit this to change the rules)
      device/screen-wake-lock.service.ts
      ui/confirm-dialog.ts
    features/
      menu/                       main menu + new-mission dialog (typed reactive form)
      mission/                    mission control, miner card, stop dialog, rules drawer
      debrief/                    saved run page
      rules/                      searchable rules content + full rules page
public/
  manifest.webmanifest, icons/    PWA manifest and Home Screen icons
ngsw-config.json                  service worker: everything prefetched for offline use
.github/workflows/deploy.yml      test, build and publish to GitHub Pages
```

### State and storage

- Two signal stores hold all state: `ActiveMissionStore` (the current mission) and `RunsStore` (the log). Components only read their signals and call their methods.
- Every change is written to `localStorage` through `core/storage/local-store.ts`:

  | Key | Contents |
  | --- | --- |
  | `drg.v2.active-mission` | `ActiveMission \| null`, the mission in progress |
  | `drg.v2.runs` | `SavedRun[]`, the mission log |
  | `drg.v2.roster` | last player name per dwarf class |

- The clock is stored as timestamps (`accumulatedMs` + `runningSince`), not as a ticking counter, so it stays correct through reloads, sleep and screen lock.
- If you change the shape of anything persisted, either migrate it where it's read or bump the key version.

### Look and feel

The UI is styled like a printed field manual: paper pages on a dark rock backdrop, amber section bands, warning tape, stencil numerals (Saira Stencil One) and condensed body text (Barlow Semi Condensed). Every colour, font and radius is a token in `src/styles/_tokens.scss`; change it there and the whole app follows. Fonts and icons are installed from npm, never loaded from a CDN, so nothing breaks offline.

---

## Rules reference: updating it from your rulebook PDF

The rules live in `src/app/core/rules/rules.data.ts` as `RULE_SECTIONS`. Each section has a short `tab` label (thumb index), a `title`, a Material Symbols `icon`, `entries` (title + short lines) and an optional `table`. The panel and search pick up whatever is in that file.

The current text was written from a rules summary of the base game. Check the numbers against your 2nd-edition rulebook. To refresh it with Claude Code, put the PDF in the repo folder (it's git-ignored if you name it `*.pdf`, see below) and ask:

> Read `rulebook.pdf`. Update `src/app/core/rules/rules.data.ts` so every entry matches the 2nd-edition rules. Write short paraphrases in your own words, at most two sentences per line; don't copy rulebook text. Keep the existing section ids and the House rules section. Then run `npm test` and `npm run build`.

Keep the reference short and in your own words: the rulebook is copyrighted, and short lines are faster to read at the table anyway.

---

## Working on it with Claude Code

Open the repo folder in a terminal and run `claude`. `CLAUDE.md` in the root gives Claude Code the project conventions (stack, where state lives, styling tokens, offline rules, how to verify). Example requests:

- "Add personal quests: each dwarf gets a random quest at mission start; when I mark it complete, roll a random reward from a weighted table and show it on the miner card. Save quests and rewards in the run."
- "Add a Players page with all-time stats per player across the mission log."
- "Track the swarm meter position itself: a +1 / +2 event button that applies the overflow multiplier automatically."
- "Let me rename the mission from the mission control header."

## Roadmap ideas

- **Personal quests with random upgrades** (house rule): quest per player, tiers, weighted reward table, no duplicate perks.
- **Career stats** per player across all runs.
- **Swarm meter tracker** that applies the overflow multiplier for you.
- **Mission modifiers**: roll a warning and an anomaly before each mission.
- **Deep Dive mode**: chain missions and carry health/ammo/upgrades over.
- **Player phones**: each player sees their own secret quest (needs a small sync backend).
