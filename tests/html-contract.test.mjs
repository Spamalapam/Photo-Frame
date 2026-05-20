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

test('Three-photo auto layout staggers photos instead of using one shallow row', () => {
  assert.match(html, /x:\s*22,\s*y:\s*27,\s*w:\s*37,\s*h:\s*40/);
  assert.match(html, /x:\s*77,\s*y:\s*27,\s*w:\s*37,\s*h:\s*40/);
  assert.match(html, /x:\s*50,\s*y:\s*66,\s*w:\s*40,\s*h:\s*32/);
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

test('Weather is locked to American Fork, Utah', () => {
  assert.match(html, /AMERICAN_FORK_WEATHER\s*=\s*Object\.freeze/);
  assert.match(html, /label:\s*'American Fork, UT'/);
  assert.match(html, /lat:\s*40\.3769/);
  assert.match(html, /lon:\s*-111\.7958/);
});
