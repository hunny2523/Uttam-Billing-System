import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public';

// SVG logo
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1f2937"/>
  <circle cx="256" cy="256" r="200" fill="#3b82f6"/>
  <text x="256" y="300" font-size="120" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">₹</text>
</svg>
`;

async function generateIcons() {
  try {
    console.log('Generating PWA icons...');

    // 192x192 icon
    await sharp(Buffer.from(svgIcon))
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✓ Created icon-192.png');

    // 512x512 icon
    await sharp(Buffer.from(svgIcon))
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✓ Created icon-512.png');

    // Maskable icons (same for now)
    await sharp(Buffer.from(svgIcon))
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192-maskable.png'));
    console.log('✓ Created icon-192-maskable.png');

    await sharp(Buffer.from(svgIcon))
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512-maskable.png'));
    console.log('✓ Created icon-512-maskable.png');

    console.log('\nAll icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
