# Kalande Kapaya — Portfolio

A single-page portfolio site. No build step: open `index.html` in a browser, or serve the
folder with any static host (GitHub Pages, Netlify, Vercel…).

## Design

The look of the site is adapted from five CodePen pens by other creators. They are used
as design elements only; they are not my projects.

| Site section | Design source | What it does on this site |
| --- | --- | --- |
| Lock screen | *App Menu With Lock Screen* by Hyperplexed, *Digital Rain* by Sara Mazal | Clock, date and PIN pad (`1234`) over cyan digital rain. "Skip intro" or <kbd>Esc</kbd> bypasses it; the lock button in the header brings it back. |
| Hero | *Particles Cursor*, built on [threejs-toys](https://github.com/klevron/threejs-toys) by Kevin Levron | GPU particle swarm that follows the cursor; click to remix it. |
| Workspace | *Glassmorphism Creative Cloud App Redesign*, after a Dribbble shot by Mikołaj Gałęziowski | Frosted-glass app window with project list, search, filters, dropdowns, details pop-up, skills/about tabs and a light/dark toggle. |
| Featured | *Magic Card* | Spinning gradient-border cards for featured projects. |
| Code | *Digital Rain* by Sara Mazal | Full-screen digital rain behind a glass terminal that types out who I am. |

A shared palette ties the pieces together: the rain's cyan, the Magic Card gradient
(`#5ddcff → #3c67e3 → #4e00c2`) and the glassmorphism surfaces.

## Editing

- **Projects:** replace the placeholder entries in the `PROJECTS` array at the top of
  `script.js`. The workspace list, counters and featured cards are generated from it
  (`featured: true` puts a project on a featured card; leave `url` empty until it has a link).
- **Text:** hero, skills and about copy live in `index.html`; the terminal text is
  `TERMINAL_TEXT` in `script.js`.
- **Contact email:** replace `you@example.com` in `index.html`.
- **PIN:** change `PIN` in `script.js` (and the hint text in `index.html`).

## Credits

Design adapted from CodePen pens by Hyperplexed, Sara Mazal, Kevin Levron (threejs-toys, loaded
from unpkg), and the creators of the *Glassmorphism Creative Cloud App Redesign* and *Magic Card*
pens. Icons from [Feather](https://feathericons.com) (MIT).
