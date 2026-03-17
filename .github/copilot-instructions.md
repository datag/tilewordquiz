# TileWordQuiz – Copilot Instructions

## What This Is

A kids' word-matching quiz app built with **Tauri 2** (Rust shell) wrapping a plain **HTML/CSS/JS** frontend. There is no bundler or build step for the frontend — `src/` is served as static files both by Tauri and deployed directly to GitHub Pages.

The Rust backend in `src-tauri/` is minimal — it only bootstraps Tauri. All game logic lives in the frontend JS.

## Build & Run Commands

```sh
# Desktop dev (requires Rust + Tauri CLI)
cargo tauri dev

# Android dev / release
cargo tauri android dev
cargo tauri android build --target=aarch64

# Re-initialize Android project
cargo tauri android init
cargo tauri icon src/assets/images/logo.svg
```

There is no `npm install` or frontend build step. For web-only changes, open `src/index.html` directly in a browser or push to `main` — GitHub Actions deploys `src/` to GitHub Pages automatically.

## Architecture

```
src/                  # Frontend (static, no bundler)
  index.html          # Single-page app; all UI defined here
  js/
    main.js           # Game loop, DOM wiring, audio
    questions.js      # Static question bank (exported array)
    settings.js       # Settings module (localStorage-backed)
    ai.js             # OpenAI API integration (optional)
  css/styles.css      # All custom styles
  assets/             # Font (Grundschrift), audio (.ogg), logo
  libs/               # Vendored Bootstrap 5 CSS, jQuery 3 slim

src-tauri/            # Tauri shell (Rust) — minimal, no custom commands
```

**JS modules** use native ES module imports (`type="module"`). `Settings` and `AiQuestion` use the revealing module pattern (IIFE returning an object). jQuery is loaded as a module and available globally via `withGlobalTauri: true`.

## Question Data Structure

Questions live in `src/js/questions.js` as a flat exported array. Each question:

```js
{
    type: "emoji" | "color" | "alphanumeric" | "symbol",
    options: [            // exactly 4 items
        {
            value: "Hund",   // word shown in the question area (can be string[] for variants)
            option: "🐶",    // tile content: emoji, hex color string, or character (can be string[] for variants)
        },
        // ...
    ],
    flags: ["no-grundschrift"],  // optional; disables Grundschrift font for the word
    note: "Hint text",           // optional; shown below the tiles
}
```

- **`type: "color"`** — `option` is a CSS hex color string applied as `backgroundColor`
- **`type: "emoji"` / `"symbol"`** — `option` is a single Unicode character / emoji
- **`type: "alphanumeric"`** — `option` is a character rendered in Grundschrift font
- **Array values**: if `option.value` and `option.option` are arrays, the game picks the same index from both (variant pairing)
- AI mode only ever generates `type: "emoji"` questions (hardcoded in the OpenAI JSON schema)

## Game Flow

1. `newGame()` resets score and calls `fetchNextQuestion()` (async, runs in background)
2. `nextQuestion()` awaits the prefetched question, shuffles options, picks the correct answer index (`game.optionIndex`), then renders
3. On answer: shows feedback, prefetches next question, waits 750ms (correct) or 3500ms (wrong), then calls `nextQuestion()` again
4. The correct answer is always tracked via `game.optionIndex` — **after** the shuffle

## Key Conventions

- **Grundschrift font**: Applied via `.grundschrift` CSS class on `#question`. Answer tiles of type `alphanumeric` always use it. The `no-grundschrift` flag suppresses it for the question word.
- **Tile CSS classes**: Answer `<button>` elements get `type-{type}` class dynamically on each render (e.g., `type-emoji`, `type-color`). Correct/wrong feedback uses `.correct` / `.wrong` outline classes.
- **Click blocking**: `.disable-clicks` (`pointer-events: none`) is added to answers and the new-game button during transitions and AI fetch delays.
- **Settings persistence**: All settings stored in `localStorage` under key `'appSettings'`. Defaults defined in `settings.js` — always merge with stored values on load.
- **Audio**: Web Audio API, `.ogg` files loaded via `fetch()` at startup. Three samples: `correct`, `wrong`, `highscore`.
- **`src/` is the single source of truth** for both the desktop app (`frontendDist: "../src"` in `tauri.conf.json`) and the GitHub Pages deployment.
