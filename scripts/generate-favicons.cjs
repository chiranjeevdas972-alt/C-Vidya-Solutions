const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Read the base SVG
const svgPath = path.join(__dirname, '../public/favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  console.log('Starting icon generation from SVG...');

  const publicDir = path.join(__dirname, '../public');

  // Sizes to generate
  const pngSizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 }, // Crucial for Google Search (multiple of 48px)
    { name: 'favicon-96x96.png', size: 96 }, // Crucial for Google Search (multiple of 48px)
    { name: 'favicon-144x144.png', size: 144 }, // Crucial for Google Search (multiple of 48px)
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'mstile-150x150.png', size: 150 },
    { name: 'logo.png', size: 512 }
  ];

  for (const item of pngSizes) {
    const dest = path.join(publicDir, item.name);
    await sharp(svgBuffer)
      .resize(item.size, item.size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ compressionLevel: 9 })
      .toFile(dest);
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);
  }

  // 2. Generate a valid multi-size favicon.ico containing 16x16, 32x32, 48x48
  // Standard ICO format with embedded PNG streams
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(svgBuffer)
      .resize(s, s, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    pngBuffers.push({ size: s, buffer: buf });
  }

  // Build ICO binary structure
  // Header: 6 bytes
  // Directory entries: 16 bytes each
  // Image data follows
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let currentOffset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // image type: 1 = ICO
  header.writeUInt16LE(count, 4); // count

  const dirEntries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // color count (0 = >= 256)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // data size
    entry.writeUInt32LE(currentOffset, 12); // offset
    dirEntries.push(entry);
    currentOffset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(b => b.buffer)
  ]);

  const icoPath = path.join(publicDir, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`Generated favicon.ico with ${count} resolutions (16x16, 32x32, 48x48) - size: ${icoBuffer.length} bytes`);

  // 3. Generate Social Card (og:image / twitter:image) 1200x630
  // Clean branded banner with C Vidya Solutions icon and official company typography
  const socialSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#050B17" />
          <stop offset="50%" stop-color="#0A1833" />
          <stop offset="100%" stop-color="#061226" />
        </linearGradient>
        <linearGradient id="chevron-blue-grad" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#2979FF" />
          <stop offset="30%" stop-color="#00E5FF" />
          <stop offset="65%" stop-color="#0072FF" />
          <stop offset="100%" stop-color="#0B214B" />
        </linearGradient>
        <linearGradient id="inner-bar-blue-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0072FF" />
          <stop offset="40%" stop-color="#00C6FF" />
          <stop offset="100%" stop-color="#031633" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#00E5FF" flood-opacity="0.25" />
        </filter>
      </defs>
      <rect width="1200" height="630" fill="url(#bg-grad)" />
      
      <!-- Ambient Glow Circle behind icon -->
      <circle cx="280" cy="315" r="220" fill="#0072FF" opacity="0.12" filter="blur(60px)" />
      
      <!-- Main Chevron Logo Mark centered vertically on left -->
      <g transform="translate(40, 75) scale(1.2)" filter="url(#shadow)">
        <path d="M 315,90 L 580,280 L 345,450 L 380,395 L 485,280 L 318,160 Z" fill="url(#chevron-blue-grad)" />
        <path d="M 312,320 L 425,240 L 452,268 L 312,415 Z" fill="url(#inner-bar-blue-grad)" />
      </g>
      
      <!-- Brand Name & Description -->
      <text x="560" y="270" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="58" font-weight="900" fill="#FFFFFF" letter-spacing="1">C VIDYA SOLUTIONS</text>
      <text x="560" y="330" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" fill="#00E5FF" letter-spacing="4">ARCHITECTING THE DIGITAL FUTURE</text>
      <text x="560" y="390" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94A3B8">SaaS Products • Autonomous AI Agents • Enterprise Software</text>
      <text x="560" y="440" font-family="monospace" font-size="18" font-weight="600" fill="#E2E8F0">cvidyasolutions.com</text>
    </svg>
  `;

  const ogCardPath = path.join(publicDir, 'og-image.png');
  await sharp(Buffer.from(socialSvg))
    .png({ compressionLevel: 8 })
    .toFile(ogCardPath);
  console.log('Generated og-image.png (1200x630)');

  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
