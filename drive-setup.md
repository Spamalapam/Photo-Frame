# Google Drive sync — one-time setup

The frame reads photos from a publicly-shared Google Drive folder using the
Drive API. It needs an API key (5-minute setup, free, no billing) and the
folder set to *Anyone with the link can view*. After that, dragging photos
into the Drive app from your phone is all the workflow there is.

## Step 1 — make the Drive folder shareable

You already have a folder:
`https://drive.google.com/drive/folders/1VN_d4wvVgWbtr3kzyyygO_XthVFZPXfY`

Open it on your laptop or phone, click **Share**, and set the access to
*"Anyone with the link" → Viewer*. That's all the Drive side needs.

The folder belongs to `runner4evs@gmail.com`; that detail isn't actually used
by the frame — it just identifies which Google account owns the folder.
Anyone with the link can view, but only you (signed in to that account) can
add or delete photos. That asymmetry is exactly what we want.

## Step 2 — create a Google Cloud API key

1. Go to **https://console.cloud.google.com/** while signed in as
   `runner4evs@gmail.com`. (You can use the same account; this is included in
   the free tier and won't cost anything.)
2. If this is your first time, accept the terms and create a project. Name
   it anything — *Adam's Frame* works.
3. In the search bar at the top, search for **"Google Drive API"**, click
   it, then click **Enable**.
4. From the left menu, go to **APIs & Services → Credentials**.
5. Click **+ Create credentials → API key**.
6. Copy the key it gives you. It starts with `AIza...`.

## Step 3 — lock the key down (recommended)

The API key will end up in your HTML on GitHub Pages, so anyone who views the
source can see it. That's fine *if* you restrict where the key works:

1. Still on the Credentials page, click the key you just made → **Edit**.
2. Under **Application restrictions**, choose **HTTP referrers (web sites)**.
3. Add these referrers:
   - `https://spamalapam.github.io/Photo-Frame/*`
   - `https://spamalapam.github.io/*` (in case you ever move it)
   - `http://localhost/*` (for testing)
4. Under **API restrictions**, choose **Restrict key → Google Drive API**.
5. Click **Save**.

Now even if someone copies your key, it only works from your domain. Worst
case is they list the photos in your public folder, which they could already
see by visiting the folder URL anyway.

## Step 4 — paste both into the frame

1. Open the frame on the tablet (or anywhere — settings sync via
   `localStorage`).
2. Tap the gear icon → scroll to **Photos · Google Drive folder**.
3. The folder ID is already pre-filled. If you change folders, paste the new
   ID — it's the long string at the end of the folder share URL.
4. Paste the API key into the *API key* field.
5. Tap **Sync from Drive**.

You should see "Listing Drive folder…" → "Downloading 1/N…" → "Synced N from
Drive". Photos appear on the cork board within seconds.

## Step 5 — adding photos from your phone

Easiest path:

1. Open the **Google Drive app** on your phone.
2. Navigate to the shared folder.
3. Tap **+** → **Upload** → pick photos from your camera roll.

Or, if your phone backs up to Google Photos (most do):

1. Open Google Photos, find the photo, tap **Share → Save to Drive**, choose
   the folder.

Then on the tablet, tap settings → **Sync from Drive**. The frame swaps in
the new photos. (It also auto-syncs whenever the cache is older than an
hour, so if you don't manually sync, it'll catch up on its own.)

## Notes on quotas

- Drive API free tier: about **1 billion queries/day**. You'll hit the heat
  death of the universe before this.
- Drive storage: counts against your 15 GB free-tier Google account quota
  (shared with Gmail, Photos, etc.).
- Per-photo size: no practical limit, but pre-compressing via
  `compress.html` saves bandwidth on the tablet's first sync.

## Troubleshooting

- **"403"** on sync → folder is not shared with "Anyone with the link", or
  the API key restrictions are too tight.
- **"400"** on sync → folder ID is wrong, OR the Drive API isn't enabled
  on your Cloud project.
- **Photos appear blank/broken** → the file isn't actually an image
  (mimeType filter should catch this; check the Drive folder for stray
  PDFs or `.heic` files some browsers can't decode).
- **"Sync from Drive" does nothing** → open the browser console; rate
  limits or referrer mismatches show up there.
