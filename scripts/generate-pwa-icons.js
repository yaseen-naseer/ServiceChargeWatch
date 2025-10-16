const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// SVG source for the icon
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with gradient -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="128" fill="url(#gradient)" />

  <!-- SC Text -->
  <text
    x="256"
    y="320"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="220"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
  >SC</text>

  <!-- Currency symbol decoration -->
  <circle cx="410" cy="120" r="40" fill="rgba(255,255,255,0.15)" />
  <text
    x="410"
    y="132"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="40"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
  >$</text>
</svg>
`;

// Icon configurations
const icons = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' },
];

// Generate icons
async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  try {
    for (const icon of icons) {
      const outputPath = path.join(publicDir, icon.name);

      await sharp(Buffer.from(iconSvg))
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate favicon.ico (using 32x32 as base)
    const faviconPath = path.join(publicDir, 'favicon.ico');
    await sharp(Buffer.from(iconSvg))
      .resize(32, 32)
      .png()
      .toFile(faviconPath);

    console.log('✅ Generated favicon.ico (32x32)');

    console.log('\n✨ All PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run the script
generateIcons();
