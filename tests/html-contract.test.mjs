import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Google Drive source is baked into the default settings', () => {
  assert.match(html, /DEFAULT_DRIVE_API_KEY\s*=\s*'AIzaSyCV3jO5ueYzlVgitH-UUxYC2or5zT0Xghk'/);
  assert.match(html, /DEFAULT_DRIVE_FOLDER_ID\s*=\s*'1VN_d4wvVgWbtr3kzyyygO_XthVFZPXfY'/);
  assert.match(html, /gdKey:\s*DEFAULT_DRIVE_API_KEY/);
  assert.match(html, /gdFolder:\s*DEFAULT_DRIVE_FOLDER_ID/);
});

test('Drive sync and rendering support photos and videos', () => {
  assert.match(html, /mimeType contains 'image\/' or mimeType contains 'video\/'/);
  assert.match(html, /function createMediaElement/);
  assert.match(html, /document\.createElement\('video'\)/);
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

test('Auto layout uses dynamic slots and media aspect fitting', () => {
  assert.match(html, /Math\.min\(12, count\)/);
  assert.match(html, /function fitSlotToAspect/);
  assert.match(html, /object-fit: cover/);
});

test('Weather is locked to American Fork, Utah', () => {
  assert.match(html, /AMERICAN_FORK_WEATHER\s*=\s*Object\.freeze/);
  assert.match(html, /label:\s*'American Fork, UT'/);
  assert.match(html, /lat:\s*40\.3769/);
  assert.match(html, /lon:\s*-111\.7958/);
});
