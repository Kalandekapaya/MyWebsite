# Kalande Kapaya — Portfolio

A single-page portfolio that blends five of my CodePen experiments into one site.
No build step: open `index.html` in a browser, or serve the folder with any static host
(GitHub Pages, Netlify, Vercel…).

| Section | Built from | What it does |
| --- | --- | --- |
| Lock screen | [App Menu With Lock Screen](https://codepen.io/kalande-kapaya/pen/eYjwMXV) + [Matrix](https://codepen.io/kalande-kapaya/pen/yLRbZaR) | Clock, date and PIN pad (`1234`) over cyan digital rain. "Skip intro" or <kbd>Esc</kbd> bypasses it; the lock button in the header brings it back. |
| Hero | [ThreeJS Toys – Particles Cursor](https://codepen.io/kalande-kapaya/pen/ZEqKwrZ) | GPU particle swarm that follows the cursor; click to remix it. |
| Workspace | [Glassmorphism Creative Cloud App Redesign](https://codepen.io/kalande-kapaya/pen/abQKMMx) | Frosted-glass app window with project list, search, category filters, dropdowns, details pop-up, skills/about tabs and a light/dark toggle. |
| Featured | [Magic Card](https://codepen.io/kalande-kapaya/pen/MWzXRwz) | Spinning gradient-border cards for featured projects. |
| Code | [Matrix](https://codepen.io/kalande-kapaya/pen/yLRbZaR) | Full-screen digital rain behind a glass terminal that types out who I am. |

The palette ties everything together: the Matrix cyan, the Magic Card gradient
(`#5ddcff → #3c67e3 → #4e00c2`) and the glassmorphism surfaces are used across every section.

## Editing

- **Projects:** edit the `PROJECTS` array at the top of `script.js`. The workspace list,
  counters and featured cards are generated from it (`featured: true` puts a project on a magic card).
- **Text:** hero, skills and about copy live in `index.html`.
- **Contact email:** replace `you@example.com` in `index.html`.
- **PIN:** change `PIN` in `script.js` (and the hint text in `index.html`).

## Credits

Inspired by Mikołaj Gałęziowski (glassmorphism), Hyperplexed (lock screen) and Sara Mazal (digital rain).
Particles by [threejs-toys](https://github.com/klevron/threejs-toys) by Kevin Levron, loaded from unpkg.
Icons from [Feather](https://feathericons.com) (MIT).
