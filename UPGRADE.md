# Photo-Frame v2 — upgrade notes

## v2.2 — fluid S7+ layout, merged guest photos

- **Fluid layout for the Tab S7+ fullscreen.** Widget typography, sticky-note
  sizing, the wood frame border, and the corner brackets now scale
  continuously with the viewport via `clamp()` — the S7+ fullscreen viewport
  (~1280 css px landscape) hits the tuned design exactly, and every other
  size (portrait, split-screen, browser-with-address-bar) interpolates
  smoothly instead of jumping between breakpoints.
- **Guest photos now MIX instead of replace.** The guest toggle (renamed
  *Include Guest Photos*) is additive: when ON, the family folder and the
  guest folder sync together and shuffle into one combined rotation; when
  OFF, it's family only. Previously the toggle switched the frame to the
  guest folder *instead of* the family one. The Drive status panel shows
  both folders, and the sync toast reports how many guest photos joined.
  Each folder's own `photos.json` captions still apply.
- **Offline cache survives re-syncs.** Photos already saved to the tablet
  are no longer re-downloaded after every sync — saved copies carry over
  whenever the file is unchanged (matched by Drive checksum).
- **Offline downloads fixed.** Google recently started redirecting the
  Drive `alt=media` endpoint without CORS headers, which silently broke
  photo downloads in every browser. The cacher now falls back to the
  CORS-readable `lh3.googleusercontent.com` rendition (already
  tablet-sized, and it transcodes HEIC), with a circuit breaker so a dead
  network can't make it grind through hundreds of failing requests.
- **Shuffled play order every boot.** Unless every photo has an explicit
  `photos.json` order, the deck is shuffled at load so Single Photo mode
  gets a fresh sequence each time and both folders interleave evenly.

## v2.1 — smooth switching, offline photos, portrait layout

Nothing removed — every upgrade below is additive.

**Glitch-free photo switching** (the headline fix):

- **Layered crossfade.** The incoming photo now fades in *on top of* the old
  one, which stays fully opaque underneath until the fade completes — the old
  double-fade let the paper background flash through mid-transition.
- **Decode before fade.** Images are decoded off the main thread
  (`img.decode()`) before the fade starts, so big JPEGs no longer stutter on
  first paint.
- **Swap tokens.** Rapid taps / slow networks can no longer race two in-flight
  swaps into a blank or flickering polaroid — a newer swap cancels the older.
- **No more board lurch.** A swapped photo refits only its own polaroid.
  Previously every image load re-scored the whole board layout, so all three
  polaroids bounced around on every switch. Full re-layout still happens where
  it should (mode change, count change, sync, rotation/resize).
- **Preloading.** The next photo is picked and warmed into the browser cache
  ahead of the cycle timer, so the swap starts instantly.
- **Single Photo mode crossfades in place.** It used to clear to black and
  then load the next photo from the network.
- **Offline photo cache.** After each Drive sync the frame quietly downloads
  each image once (downscaled to tablet resolution) into IndexedDB — swaps
  then come from local storage, instant and immune to Wi-Fi blips. Toggle in
  Settings → Google Drive → *Offline Photo Cache* (default ON). Videos keep
  streaming.

**Galaxy Tab S7+ layout:**

- **Portrait support.** The sticky widgets wrap (time + weather up top, agenda
  beneath) instead of overflowing off the right edge; photo slots already had
  a compact portrait mode. Rotating the tablet now re-lays-out the board live.
- **Dynamic viewport height (`100dvh`)** so the bottom widgets aren't cropped
  when the browser address bar is visible.
- **Safe-area insets** for the rounded corners / camera cutout.

**New:**

- **Swipe next/previous** in Single Photo mode (left = next, right = back);
  the cycle timer resets so the chosen photo gets its full time.
- **PWA shell.** `manifest.json` + `sw.js` service worker keep the page, cork
  texture, and fonts working with no network, and make *Add to Home screen*
  install as a proper fullscreen app with its own icon.
- **Per-photo Ken Burns drift** — each photo gets its own direction, speed,
  and amplitude instead of every photo drifting identically in lockstep.
- **Minute-aligned clock** — the time flips exactly on the minute boundary
  (it could previously lag up to 30 s).
- Deterministic yarn-string sag (strings no longer wiggle on every redraw),
  and persistent-storage request so Android doesn't evict cached photos.

---

Drop-in upgrade for `Spamalapam/Photo-Frame`, optimized for the Galaxy Tab S7+
in landscape. Cork-forward, with remote photo album sync via GitHub.

## What's in this drop

| File | What it is | What to do with it |
| --- | --- | --- |
| `index.html` | Full v2 rewrite of the photo frame. Cork board, wooden frame, washi tape, multiple pin colors, paper-clip / tape variants on photos, yarn connectors, GitHub photo sync. | **Replace** the existing `index.html` in the repo root. |
| `map2-cork-overlay.css` | CSS overlay that re-skins `map2.html` to match the cork aesthetic. Does NOT touch any JS, so D3 / scrapbook / parks logic keeps working. | Paste the entire file contents at the **end** of `map2.html`'s `<style>` block (so it overrides the original rules). |
| `photos.json` | Optional metadata file mapping photo filenames to captions / locations / dates / sort order. | Place at the **repo root** (not inside `/photos`). Edit on github.com from your phone any time. |
| `photos-README.md` | Instructions for the album folder. | Rename to `README.md` and place inside `/photos/`. |

## Deploy in 4 steps

1. **Commit the new files** to `Spamalapam/Photo-Frame@main`:
   - Replace `index.html`
   - Apply the `map2-cork-overlay.css` block to the bottom of `map2.html`'s `<style>`
   - Commit `photos.json` to repo root
   - Create a `/photos` folder and commit `photos-README.md` inside as `README.md`
2. **Push a few photos** into `/photos` using github.com (drag-and-drop on the
   web works on iOS/Android Chrome — the GitHub mobile *apps* don't have web
   upload).
3. **Open the frame** at `https://spamalapam.github.io/Photo-Frame/` on the
   tablet. The frame auto-detects the GitHub Pages URL and pre-fills your
   username and repo, then auto-syncs on first load.
4. **Tap the gear**. If anything looks off, set the GitHub fields manually:
   - Username: `Spamalapam`
   - Repo: `Photo-Frame`
   - Folder: `photos`
   - Branch: `main`

## What changed visually

- **Wooden frame** ringing the entire viewport — actual photo-frame feel.
- **Cork board backdrop** (real cork color, fiber speckle, vignette) replaces
  the previous flat tan.
- **Polaroid variants**: some photos have washi tape, some have paper clips,
  some are plain pinned squares. Pin colors rotate (red, blue, green, yellow,
  purple, white, orange, teal). Slight rotation per photo.
- **Yarn connectors**: subtle dashed strings between adjacent photos
  (toggleable in settings).
- **Sticky widgets** (time / agenda / weather) get washi tape pinning them
  to the cork — same vocabulary as the photos.
- **Galaxy Tab S7+ landscape sizing**: bigger time/temp digits, generous tap
  targets, widget layout fits the 16:10 viewport without crowding the cork.
- **Map dashboard** picks up the same cork frame, parchment-paper map,
  hand-drawn fonts, and tactile button look.

## What's actually new

- **GitHub remote photo album.** Add photos from any device by uploading to
  `/photos` on github.com. The frame fetches the file list via the GitHub
  Contents API, downloads each image, and caches it to IndexedDB for offline
  use. Tap *Sync from GitHub* to pull updates.
  - Automatic detection of repo from `username.github.io/Repo/` URLs.
  - Auto-sync on first load if cache is empty.
- **Optional `photos.json`** for captions/locations/order. The frame matches
  by filename — unmatched photos just show without a caption.
- **Open-Meteo weather + geocoding** built in (no API key, no signup). Set
  your city in settings.
- **Configurable cork density** (3–9 photos at a time) and cycle interval.
- **Wake-lock** so the screen stays on while docked.

## A note about Google Photos

Google killed the Library API for third-party apps in March 2025. Their Picker
API only allows manually-selected photos one at a time, so a true Google
Photos album sync isn't viable for a wall frame any more. The GitHub-album
approach replaces it — same workflow (upload from phone, frame picks it up),
without the OAuth dance, and you actually own the bytes.

## S7+ kiosk-mode tips

- Chrome → menu → **Add to Home screen** to launch full-screen.
- Settings → **Display → Screen timeout** → 30 minutes (or use the wake-lock
  toggle in the frame's settings).
- Settings → Display → **Screen saver** → off.
- For true kiosk lock-down, Samsung Knox or the free
  *Fully Kiosk Browser* app pin the page and prevent stray taps.

## Troubleshooting

- **"Sync failed: 403"** — GitHub rate-limits unauthenticated API calls to
  60/hr per IP. Wait an hour or, if you outgrow that, swap `ghFetch` to use
  a personal access token (read-only `public_repo` scope is enough).
- **Photos appear and immediately fall back to "No photos yet"** — clear the
  IndexedDB cache (Settings → Clear All Photos) and re-sync.
- **The map iframe shows a cross-origin error** — only happens if you serve
  from `file://`. GitHub Pages and any HTTP server are fine.
