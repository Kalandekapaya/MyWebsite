# Kalande Kapaya — Portfolio

**Live site:** https://kalandekapaya.github.io/MyWebsite/

A single-page portfolio site. No build step: open `index.html` in a browser, or serve the
folder with any static host (GitHub Pages, Netlify, Vercel…). Pushes to `main` deploy
automatically through GitHub Pages.

## Design

| Site section | What it does |
| --- | --- |
| Lock screen | Clock, date and PIN pad (`1234`) over a Three.js particle swarm that follows the cursor. "Skip intro" or <kbd>Esc</kbd> bypasses it; the lock button in the header brings it back. |
| Home | Light theme: name, title and links over a pastel animated aurora drawn on a canvas. |
| Workspace | Frosted-glass app window with project list, search, filters, dropdowns, details pop-up, skills/about tabs and a light/dark toggle. |
| Featured | Spinning gradient-border cards for featured projects. |
| Code | Digital rain behind a glass terminal that types out who I am. |

A shared palette ties the pieces together: the rain's cyan, the card gradient
(`#5ddcff → #3c67e3 → #4e00c2`) and the glassmorphism surfaces.

## Editing

- **Projects:** edit the `PROJECTS` array at the top of `script.js`. The workspace list,
  counters and featured cards are generated from it (`featured: true` puts a project on a
  featured card; `status` is `live`, `done` or `progress`; leave `url` empty if there's no link).
- **Text:** hero, skills, about/experience and contact copy live in `index.html`; the terminal
  text is `TERMINAL_TEXT` in `script.js`.
- **PIN:** change `PIN` in `script.js` (and the hint text in `index.html`).

## Credits

Design credits: lock screen by Hyperplexed, particles cursor by Kevin Levron (threejs-toys,
loaded from unpkg), digital rain by Sara Mazal, glassmorphism app design by Mikołaj Gałęziowski.
Lock screen photo by [Leonhard Niederwimmer](https://unsplash.com/@lnlnln) on
[Unsplash](https://unsplash.com/photos/green-grass-field-under-blue-sky-during-daytime-FFnDGx3rZrA) (saved as `images/lock-bg.jpg`). Icons from [Feather](https://feathericons.com) (MIT).
