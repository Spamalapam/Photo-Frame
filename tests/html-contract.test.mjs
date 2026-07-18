import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Google Drive source is baked into the default settings', () => {
  assert.match(html, /DEFAULT_DRIVE_API_KEY\s*=\s*'AIzaSyCV3jO5ueYzlVgitH-UUxYC2or5zT0Xghk'/);
  assert.match(html, /DEFAULT_DRIVE_FOLDER_ID\s*=\s*'1VN_d4wvVgWbtr3kzyyygO_XthVFZPXfY'/);
  assert.match(html, /DEFAULT_GUEST_DRIVE_FOLDER_ID\s*=\s*'1_ztOBSUjjiFBeV_vQNtSLLCWrqkk1xL-'/);
  assert.match(html, /gdKey:\s*DEFAULT_DRIVE_API_KEY/);
  assert.match(html, /gdFolder:\s*DEFAULT_DRIVE_FOLDER_ID/);
  assert.match(html, /guestDriveFolder:\s*DEFAULT_GUEST_DRIVE_FOLDER_ID/);
});

test('Drive sync and rendering support photos and videos', () => {
  assert.match(html, /mimeType contains 'image\/' or mimeType contains 'video\/'/);
  assert.match(html, /function createMediaElement/);
  assert.match(html, /document\.createElement\('video'\)/);
  assert.match(html, /function isGifPhoto/);
  assert.match(html, /function migrateDriveMediaRecord/);
  assert.match(html, /drive\.google\.com\/thumbnail/);
  assert.match(html, /driveFileMediaUrl/);
  assert.match(html, /mp4\|m4v\|webm\|mov/);
});

test('Media failures do not remove Polaroids from the board', () => {
  assert.match(html, /function handleMediaFailure/);
  assert.doesNotMatch(html, /box\.style\.display\s*=\s*'none'/);
});

test('Guest Drive folder can be toggled on and off', () => {
  assert.match(html, /id="btn-guest-drive"/);
  assert.match(html, /guestMode:\s*false/);
  assert.match(html, /guestDriveFolder/);
  assert.match(html, /function activeDriveFolderId/);
});

test('Cork board has auto arrange, manual move, tap-to-change, and lock controls', () => {
  assert.match(html, /arrangeMode:\s*'auto'/);
  assert.match(html, /function bindPhotoInteractions/);
  assert.match(html, /function toggleSlotLock/);
  assert.match(html, /function changePhotoInBox/);
});

test('Browser fullscreen is separate from single-photo mode', () => {
  assert.match(html, /id="fullscreen-btn"/);
  assert.match(html, /id="btn-browser-fullscreen"/);
  assert.match(html, /function toggleBrowserFullscreen/);
  assert.match(html, /requestFullscreen/);
});

test('Cycle interval can be set up to 30 minutes', () => {
  assert.match(html, /id="cycle-slider" min="5" max="1800" step="5"/);
  assert.match(html, /function formatDuration/);
  assert.match(html, /Math\.min\(1800/);
});

test('Auto layout is capped to 5 photos with 3-photo default and media aspect fitting', () => {
  assert.match(html, /id="cork-count-slider" min="3" max="5" step="1" value="3"/);
  assert.match(html, /corkCount:\s*3/);
  assert.match(html, /Math\.min\(5, count\)/);
  assert.match(html, /function fitSlotToAspect/);
  assert.match(html, /object-fit: contain/);
});

test('Three-photo auto layout is chosen from the full visible photo aspect mix', () => {
  assert.match(html, /function classifyPhotoAspect/);
  assert.match(html, /function generateThreePhotoSlots/);
  assert.match(html, /function candidateThreePhotoLayouts/);
  assert.match(html, /function fitSlotsForAspects/);
  assert.match(html, /function scoreThreePhotoLayout/);
  assert.match(html, /function overlapPenalty/);
  assert.match(html, /bestScore/);
  assert.match(html, /wideTopTwoTall/);
  assert.match(html, /leftTallRightStack/);
  assert.match(html, /threePortraitColumns/);
  assert.match(html, /generateCorkSlots\(photos\.length,\s*undefined,\s*undefined,\s*photos\.map\(p => p\?\.aspect\)\)/);
  assert.match(html, /function relayoutCorkBoard/);
  assert.match(html, /relayoutCorkBoard\(\)/);
  assert.match(html, /82 - h \/ 2/);
});

test('Night dimming and optional gentle photo motion are configurable', () => {
  assert.match(html, /id="btn-auto-dim"/);
  assert.match(html, /id="night-brightness-slider"/);
  assert.match(html, /function applyBrightness/);
  assert.match(html, /id="btn-photo-motion"/);
  assert.match(html, /function applyMotionSetting/);
  assert.match(html, /body\.motion-on \.ken-burns/);
});

test('Cork board uses a generated bitmap texture asset', () => {
  assert.match(html, /url\("assets\/corkboard-texture\.jpg"\)/);
});

test('Photo switching is glitch-free: layered crossfade, swap tokens, decode, preloading', () => {
  assert.match(html, /function crossfadeToPhoto/);
  assert.match(html, /_swapSeq/);
  assert.match(html, /media\.decode\(\)\.then/);
  assert.match(html, /function schedulePreload/);
  assert.match(html, /function preloadPhoto/);
  assert.match(html, /function refitBoxToPhoto/);
  assert.match(html, /function scheduleRelayout/);
  assert.match(html, /function slotsRoughlyEqual/);
});

test('Single Photo mode crossfades in place and supports swipe next/previous', () => {
  assert.match(html, /function bindFullscreenSwipe/);
  assert.match(html, /crossfadeToPhoto\(box, photo\)/);
});

test('Drive photos are saved to the tablet for offline display', () => {
  assert.match(html, /id="btn-offline-cache"/);
  assert.match(html, /function backgroundCacheDrivePhotos/);
  assert.match(html, /function fetchDriveImageBlob/);
  assert.match(html, /function downscaleImageBlob/);
  assert.match(html, /offlineCache:\s*s\.offlineCache !== false/);
  assert.match(html, /navigator\.storage\.persist/);
  // alt=media can redirect without CORS — the lh3 fallback keeps caching alive
  assert.match(html, /function driveLh3Url/);
  assert.match(html, /lh3\.googleusercontent\.com\/d\//);
  assert.match(html, /consecutiveFailures/);
});

test('Frame shell works offline as a PWA', async () => {
  assert.match(html, /rel="manifest"/);
  assert.match(html, /serviceWorker/);
  const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  assert.match(sw, /cork-frame-shell/);
  assert.match(sw, /networkFirst/);
  assert.match(sw, /staleWhileRevalidate/);
  const manifest = JSON.parse(await readFile(new URL('../manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.display, 'fullscreen');
  const icon = await readFile(new URL('../icon.svg', import.meta.url), 'utf8');
  assert.match(icon, /<svg/);
});

test('Layout adapts to portrait orientation and dynamic viewports', () => {
  assert.match(html, /orientation: portrait/);
  assert.match(html, /100dvh/);
  assert.match(html, /safe-area-inset/);
});

test('Guest photos merge with the family folder and shuffle together', () => {
  assert.match(html, /function activeDriveFolders/);
  assert.match(html, /function listDriveFolder/);
  assert.match(html, /Family \+ guest/);
  assert.match(html, /driveScope: scope/);
  assert.match(html, /prevBlobs/);
  assert.match(html, /shuffle\(photos\)/);
});

test('Layout is fluid for S7+ fullscreen (clamp-based sizing)', () => {
  assert.match(html, /--frame-w: clamp\(/);
  assert.match(html, /font-size: clamp\(/);
  assert.match(html, /min-width: clamp\(/);
});

test('Weather is locked to American Fork, Utah', () => {
  assert.match(html, /AMERICAN_FORK_WEATHER\s*=\s*Object\.freeze/);
  assert.match(html, /label:\s*'American Fork, UT'/);
  assert.match(html, /lat:\s*40\.3769/);
  assert.match(html, /lon:\s*-111\.7958/);
  assert.match(html, /function fetchOpenMeteoWeather/);
  assert.match(html, /function fetchNwsWeather/);
  assert.match(html, /api\.weather\.gov\/points/);
  assert.match(html, /forecastHourly/);
  assert.match(html, /function renderWeather/);
  assert.match(html, /weather unavailable/);
});
