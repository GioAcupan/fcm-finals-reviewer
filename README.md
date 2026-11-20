# FCM Finals Reviewer

A mobile-first, offline-first reviewer for **lessons 4–13**, built around the supplied lecture notes, slide exercises, and Problem Sets 4 and 5.

## What is included

- **180 original multiple-choice questions**, with easy, medium, and hard questions in every lesson.
- A worked explanation and a lesson-section or problem-set reference for every answer.
- Lesson practice, difficulty filters, question counts, shuffled choices, bookmarks, and a mistake queue.
- Timed mock exams, flagged questions, free navigation, automatic submission at expiry, and a full answer review.
- A default 30-question mixed exam with **one easy, one medium, and one hard question per lesson**.
- **10 searchable cheat sheets**, covering inference and replacement rules, proof templates, quantifiers, induction, relations, domains and ranges, function types, and composition.
- Local progress and session recovery across refreshes. Exam deadlines continue while the app is closed.
- Installable PWA with the entire question bank and cheat sheets precached. No login or external runtime services.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open **http://localhost:4173**. The development command builds and serves `dist/`; rebuild or restart after changing source files. `PORT` may override the preview port.

## Deploy to Vercel

Import **https://github.com/GioAcupan/fcm-finals-reviewer** as a new Vercel project. The repository root is the app root.

`vercel.json` supplies the settings:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | None |

HTTPS on the deployed site enables service workers and installation. No server functions or database are required. The PWA is designed for deployment at the origin root.

## Offline and data behavior

Visit online once and wait for **Ready offline**. The service worker caches the app, question bank, cheat sheets, and icons atomically. After that, navigation, new quizzes, explanations, and progress work offline, including after a page reload. Lecture video links need internet.

Every build derives a cache version from the app contents. An updated worker prepares the next offline copy without force-reloading a running session. Reopen the app after finishing a session to load the new version. `sw.js` is served with revalidation headers.

Progress, bookmarks, history, and the current session use browser-local storage. They are not synchronized between devices. Browser data deletion or storage eviction can remove them. The progress screen exports a JSON record for backup/reference; this version does not include an import screen. If local storage is blocked, the app works in memory and displays a notice.

On iOS, use **Safari → Share → Add to Home Screen**. On supported Android/desktop browsers, use **Install app** or the browser menu. Actual installation prompts vary by browser.

## Content and provenance

The app contains original MCQ adaptations, not copied lecture PDFs or scanned answer sheets. The class material stays outside this repository. Sources were read from the sibling lesson folders and the problem sets:

| Lesson | Topic | Questions |
| --- | --- | ---: |
| 4 | Validity and invalidity of arguments | 18 |
| 5 | Standard forms, inference, replacement, formal proofs | 24 |
| 6 | Quantifiers | 12 |
| 7 | Proof of implications | 15 |
| 8 | Mathematical induction | 18 |
| 9 | Relations | 24 |
| 10 | Functions, part 1 | 15 |
| 11 | Functions, part 2 | 15 |
| 12 | Injective, surjective, bijective functions | 18 |
| 13 | Composition of functions | 21 |

`PS4` and `PS5` source labels identify the supplied problem-set section/item. Other questions cite a lesson section. Extensions and combined-concept questions are labeled in their source field. Lecture-video links appear in the cheat sheets. Difficulty labels are editorial, based on the reasoning required, rather than empirically calibrated.

Mathematical corrections are intentional and called out in the relevant questions and sheets:

- **L9 Cartesian product:** with B={b,c,d}, the last first coordinates in B×{e,f} must be d, not e.
- **L11 square-root range:** √(x²−81), with x=±9 allowed, attains zero, so its range is **[0,∞)**.
- **PS5 ℝ⁺ ambiguity:** the reviewer explicitly distinguishes strictly positive and nonnegative targets; |x| from ℝ into (0,∞) is not well-defined at zero.
- **L5 formal-proof slide:** a mismatched argument/proof-table example is flagged instead of treating the inconsistent variables as one proof.
- **L8 induction:** a base case and a general induction step are essential; checking a few examples is not a proof for all natural numbers.

MCQs train recognition, calculation, and proof reasoning. They do not replace practicing handwritten full proofs, which the original exercises require.

## Verification

```sh
npm run check          # Content invariants, mathematical checks, engine tests, production build
npm run test:browser   # Browser flows, offline reload, saved exams, responsive screenshots
```

Browser tests use installed Microsoft Edge locally. On CI they use Playwright Chromium; run `npx playwright install --with-deps chromium` first. The test configuration uses port 4173. Screenshots and traces stay in ignored `test-results/`.

Checks cover the question schema, balanced exam sampling, filtering, scoring across shuffled answers and JSON round trips, mistake correction, independently evaluated counterexamples and relation properties, and algebraic identities. Browser coverage includes practice submission, bookmarks, resume, timed exam expiry, offline cold reload, cheat-sheet search, and widths **320, 375, 414, 768, and 1366 px**. Mobile layouts were visually inspected using generated screenshots. Physical iOS/Android installation was not tested.

## Editing

- `questions.js`: question bank, choices, answer keys, explanations, references, and lesson metadata.
- `cheats.js`: cheat-sheet content.
- `engine.js`: selection, shuffling, scoring, and attempt tracking.
- `app.js`: app screens and local persistence.
- `tokens.css`, `styles.css`: design tokens and responsive styles.
- `scripts/build.mjs`: static build and generated versioned service worker.

The app has **zero production dependencies**. Playwright is a development-only test dependency. Only this `fcm-finals-reviewer/` directory is a Git repository; its parent FCM folder is not part of it.
