# /photos — your remote-add album

The frame fetches every image in this folder via the GitHub API and caches it
on the tablet. Add a photo from any device, and the frame will pick it up the
next time it syncs.

## How to add a photo from your phone

1. Open `https://github.com/<you>/<repo>/tree/main/photos` on the GitHub mobile
   site (Chrome works fine; the GitHub iOS/Android apps don't have web upload).
2. Tap **Add file → Upload files**.
3. Select photos from your camera roll, then **Commit changes**.
4. On the frame, open Settings (gear icon) → **Sync from GitHub**. It
   downloads new files and crops out any you've deleted.

That's it. No OAuth, no third-party services.

## Supported formats

`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.heic`, `.bmp`

## Captions / locations / order (optional)

Add a `photos.json` file at the **repo root** (not inside /photos). Example:

```json
{
  "photos": [
    { "file": "sunrise.jpg", "caption": "Sunrise over Mt. Mitchell", "location": "Black Mountain, NC", "date": "2025-10-12", "order": 1 },
    { "file": "pickle.jpg",  "caption": "Pickle on Friday",          "location": "Living room",       "date": "2025-11-03", "order": 2 }
  ]
}
```

The frame matches by `file` name. Every field is optional; unmatched photos
just show without a caption. `order` (number) sorts the cork board if you want
deterministic layout.

## Tips

- Resize before pushing if your photos are huge — anything over 4–5 MB is
  wasteful for a 12.4" tablet. Aim for ~2000px on the long edge.
- Filenames sort lexicographically by default, so prefixing with `2026-05-`
  groups them nicely if you don't want to bother with `photos.json`.
- The frame caches everything to IndexedDB after the first sync, so it works
  offline once it's pulled the album down.
