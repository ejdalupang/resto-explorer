# BGC & Makati Eats

A phone-first web app for tracking your evergreen restaurants and discovering new ones nearby. No backend, no API keys, no cost — runs entirely in the browser using:

- **Leaflet.js** + OpenStreetMap tiles for the map
- **Overpass API** (OpenStreetMap) to discover nearby restaurants/cafes
- **Nominatim** (OpenStreetMap) to look up coordinates for your evergreen list
- **localStorage** on your phone to save your notes, hours, price range, and additions — nothing is sent to a server

## Known limitations (free data source tradeoffs)

- OpenStreetMap doesn't have ratings, menus, or reliable price info — every restaurant card links out to Google Maps for that.
- Hours/address on OSM are community-submitted and can be missing or stale — verify before you go.
- Small/local restaurants may not be found by "Locate on map" — just fill in the address manually via Edit.

## Deploy to GitHub Pages (no terminal needed)

1. Go to [github.com/new](https://github.com/new) and create a new **public** repository (e.g. `restaurant-explorer`). If you don't have a GitHub account yet, sign up free at [github.com/signup](https://github.com/signup).
2. On the new repo's page, click **"uploading an existing file"** (or Add file → Upload files).
3. Drag in these 5 files from `~/restaurant-explorer/`: `index.html`, `style.css`, `app.js`, `data.js`, `README.md`. Commit the upload.
4. Go to the repo's **Settings → Pages**.
5. Under "Build and deployment", set **Source** to "Deploy from a branch", branch = `main`, folder = `/ (root)`. Save.
6. Wait ~1 minute, then refresh — GitHub shows the live URL, something like `https://<your-username>.github.io/restaurant-explorer/`.

## Add it to your phone's home screen

- **iPhone (Safari)**: open the URL → Share button → "Add to Home Screen".
- **Android (Chrome)**: open the URL → ⋮ menu → "Add to Home screen" / "Install app".

It'll open full-screen like a regular app from then on.

## Updating your data later

- Tap **Edit** on any evergreen card to add/change address, hours, price, notes.
- Tap **Export backup** occasionally to download a JSON snapshot (in case you clear browser data or switch phones) — **Import backup** restores it.
- To add more evergreens permanently (not just on your phone), edit `data.js` and re-upload it to GitHub the same way as step 3 above.
