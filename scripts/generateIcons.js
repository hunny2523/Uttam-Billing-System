import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public';

// Path to your source image - CHANGE THIS TO YOUR IMAGE PATH
const sourceImage = './public/logo.png'; // Put your image here as logo.png

async function generateIcons() {
    try {
        console.log('Generating PWA icons from:', sourceImage);

        // Check if source image exists
        if (!fs.existsSync(sourceImage)) {
            console.error('❌ Source image not found:', sourceImage);
            console.log('Please place your icon image at:', sourceImage);
            process.exit(1);
        }

        // 192x192 icon
        await sharp(sourceImage)
            .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(path.join(publicDir, 'icon-192.png'));
        console.log('✓ Created icon-192.png');

        // 512x512 icon
        await sharp(sourceImage)
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(path.join(publicDir, 'icon-512.png'));
        console.log('✓ Created icon-512.png');

        // Maskable icons (with padding for safe zone)
        await sharp(sourceImage)
            .resize(154, 154, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .extend({
                top: 19,
                bottom: 19,
                left: 19,
                right: 19,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .png()
            .toFile(path.join(publicDir, 'icon-192-maskable.png'));
        console.log('✓ Created icon-192-maskable.png');

        await sharp(sourceImage)
            .resize(410, 410, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .extend({
                top: 51,
                bottom: 51,
                left: 51,
                right: 51,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
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
