# Photo-Frame v2 — upgrade notes

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
