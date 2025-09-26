#!/usr/bin/env node
/**
 * Re-encode all .mp4 files under public/ to H.264 (libx264) + AAC for broad browser compatibility.
 *
 * Requirements:
 * - FFmpeg must be installed and available on PATH.
 *
 * Usage:
 *   npm run videos:reencode
 */

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');

async function which(cmd) {
  return new Promise((resolve) => {
    const p = spawn(process.platform === 'win32' ? 'where' : 'which', [cmd]);
    p.on('error', () => resolve(null));
    p.on('close', (code) => resolve(code === 0 ? cmd : null));
  });
}

async function findMp4Files(dir) {
  /** Recursively find .mp4 files under dir */
  const results = [];
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp4')) {
        results.push(full);
      }
    }
  }
  try {
    await walk(dir);
  } catch (e) {
    // if public dir missing, that's OK
  }
  return results;
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: 'inherit' });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

async function reencodeFile(file) {
  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  const tmpOut = path.join(dir, `${base}.reencoded.tmp.mp4`);

  // Build ffmpeg args for H.264 (libx264) + AAC with web-friendly flags
  const args = [
    '-y',
    '-i', file,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.1',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-ac', '2',
    tmpOut,
  ];

  console.log(`\nRe-encoding: ${path.relative(projectRoot, file)}`);
  await runFfmpeg(args);

  // Replace original atomically
  const backup = path.join(dir, `${base}.orig.backup.mp4`);
  // If a previous backup exists, remove it to avoid clutter
  try { await fs.unlink(backup); } catch {}
  await fs.rename(file, backup);
  await fs.rename(tmpOut, file);
  console.log(`✔ Replaced original. Backup saved at ${path.relative(projectRoot, backup)}`);
}

async function main() {
  const hasFfmpeg = await which('ffmpeg');
  if (!hasFfmpeg) {
    console.error('Error: ffmpeg not found on PATH.');
    console.error('Please install FFmpeg and ensure the "ffmpeg" command is available.');
    console.error('Download: https://ffmpeg.org/download.html');
    process.exit(1);
  }

  const files = await findMp4Files(publicDir);
  if (!files.length) {
    console.log('No .mp4 files found under public/. Nothing to do.');
    return;
  }

  console.log(`Found ${files.length} .mp4 file(s) under public/.`);
  for (const file of files) {
    try {
      await reencodeFile(file);
    } catch (e) {
      console.error(`✖ Failed to re-encode ${file}:`, e.message || e);
    }
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
