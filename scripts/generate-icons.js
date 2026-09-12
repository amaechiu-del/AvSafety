import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Helper to write a valid PNG buffer from RGBA pixel data
function createPng(width, height, getPixelRgba) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression: deflate
  ihdrData[11] = 0; // Filter: default
  ihdrData[12] = 0; // Interlace: none
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with scanline filter bytes (0 = None)
  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawScanlines[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      rawScanlines[offset++] = r;
      rawScanlines[offset++] = g;
      rawScanlines[offset++] = b;
      rawScanlines[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 calculation table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + length);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// Color palettes for Aviation Safety Summit 2026
// Navy: #0A192F (10, 25, 47)
// Deep Navy: #071324 (7, 19, 36)
// Gold: #D4AF37 (212, 175, 55)
// Light Gold: #FCEBA4 (252, 235, 164)
// Dark Gold: #997A1E (153, 122, 30)
// White: (255, 255, 255)

function renderSummitIcon(x, y, w, h, isMaskable = false) {
  const nx = (x / w) * 2 - 1; // -1 to 1
  const ny = (y / h) * 2 - 1; // -1 to 1
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Background Gradient (Navy to Dark Slate)
  const bgR = Math.round(10 - ny * 5);
  const bgG = Math.round(25 - ny * 8);
  const bgB = Math.round(47 - ny * 15);

  // If maskable, full bleed background with safe zone padding
  const scale = isMaskable ? 0.75 : 0.9;
  const sx = nx / scale;
  const sy = ny / scale;
  const sDist = Math.sqrt(sx * sx + sy * sy);

  // Rounded squircle boundary if standard icon
  if (!isMaskable && (Math.abs(nx) > 0.92 || Math.abs(ny) > 0.92)) {
    const cornerDist = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4);
    if (cornerDist > 0.85) return [0, 0, 0, 0]; // Transparent outside squircle
  }

  // Outer Gold Rings
  if (sDist > 0.78 && sDist < 0.82) {
    return [212, 175, 55, 255]; // Gold ring
  }
  if (sDist > 0.74 && sDist < 0.76) {
    return [252, 235, 164, 200]; // Inner thin gold ring
  }

  // Central Aviation Shield & Jet
  // Shield shape calculation
  const shieldTop = -0.55;
  const shieldBottom = 0.55;
  if (sy > shieldTop && sy < shieldBottom && Math.abs(sx) < 0.5) {
    const taper = sy > 0.1 ? (1 - (sy - 0.1) / 0.45) : 1;
    if (Math.abs(sx) < 0.42 * taper) {
      // Inside shield

      // Airplane Wings & Body
      // Center fuselage
      if (Math.abs(sx) < 0.045 && sy > -0.45 && sy < 0.35) {
        return [252, 235, 164, 255]; // Bright Gold
      }
      // Main Wings
      if (sy > -0.15 && sy < 0.02 && Math.abs(sx) < 0.38) {
        const wingSlope = -0.15 + Math.abs(sx) * 0.4;
        if (sy > wingSlope - 0.06 && sy < wingSlope + 0.06) {
          return [212, 175, 55, 255]; // Gold Wings
        }
      }
      // Tail Wings
      if (sy > 0.22 && sy < 0.32 && Math.abs(sx) < 0.18) {
        return [212, 175, 55, 240];
      }

      // Safety Star at top of shield
      if (Math.hypot(sx, sy - (-0.35)) < 0.04) {
        return [255, 255, 255, 255];
      }

      // Shield Interior Base (Deep Navy with Subtle Gold Glow)
      return [14, 30, 56, 255];
    }
  }

  // Subtle radial gold ambient glow behind shield
  if (sDist < 0.65) {
    const glowIntensity = Math.max(0, 1 - sDist / 0.65) * 0.25;
    const r = Math.min(255, Math.round(bgR + glowIntensity * 212));
    const g = Math.min(255, Math.round(bgG + glowIntensity * 175));
    const b = Math.min(255, Math.round(bgB + glowIntensity * 55));
    return [r, g, b, 255];
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192 PNG
const png192 = createPng(192, 192, (x, y, w, h) => renderSummitIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
console.log('✓ Generated public/pwa-192x192.png');

// Generate 512x512 PNG
const png512 = createPng(512, 512, (x, y, w, h) => renderSummitIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
console.log('✓ Generated public/pwa-512x512.png');

// Generate 512x512 Maskable PNG (full-bleed with safe margin)
const pngMaskable = createPng(512, 512, (x, y, w, h) => renderSummitIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);
console.log('✓ Generated public/pwa-maskable-512x512.png');

// Generate 180x180 Apple Touch Icon PNG
const pngApple = createPng(180, 180, (x, y, w, h) => renderSummitIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);
console.log('✓ Generated public/apple-touch-icon.png');

// Generate 32x32 Favicon
const pngFavicon = createPng(32, 32, (x, y, w, h) => renderSummitIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pngFavicon);
console.log('✓ Generated public/favicon.ico');
