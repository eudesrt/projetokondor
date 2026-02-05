/**
 * Dynamic Hero Image Background Color Extractor
 * Extracts dominant colors from the hero image and applies them as background
 */

document.addEventListener('DOMContentLoaded', function() {
    const heroImage = document.querySelector('.hero-image');
    const heroContainer = document.querySelector('.hero-image-container');
    
    if (!heroImage || !heroContainer) return;
    
    // Wait for image to load
    if (heroImage.complete) {
        extractAndApplyColors(heroImage, heroContainer);
    } else {
        heroImage.addEventListener('load', function() {
            extractAndApplyColors(heroImage, heroContainer);
        });
    }
});

function extractAndApplyColors(img, container) {
    try {
        // Create a canvas to analyze the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Use a smaller canvas for performance
        const scaleFactor = 0.1;
        canvas.width = img.naturalWidth * scaleFactor;
        canvas.height = img.naturalHeight * scaleFactor;
        
        // Draw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Sample colors from the edges (where background would be visible)
        const colors = [];
        const sampleSize = 20;
        
        // Sample from top, bottom, left, right edges
        for (let i = 0; i < sampleSize; i++) {
            // Top edge
            const topIdx = (i * canvas.width * 4) + (Math.floor(canvas.width / 2) * 4);
            // Bottom edge
            const bottomIdx = ((canvas.height - 1 - i) * canvas.width * 4) + (Math.floor(canvas.width / 2) * 4);
            // Left edge
            const leftIdx = (Math.floor(canvas.height / 2) * canvas.width * 4) + (i * 4);
            // Right edge
            const rightIdx = (Math.floor(canvas.height / 2) * canvas.width * 4) + ((canvas.width - 1 - i) * 4);
            
            [topIdx, bottomIdx, leftIdx, rightIdx].forEach(idx => {
                if (idx < pixels.length - 2) {
                    colors.push({
                        r: pixels[idx],
                        g: pixels[idx + 1],
                        b: pixels[idx + 2]
                    });
                }
            });
        }
        
        // Calculate average color
        const avgColor = colors.reduce((acc, color) => {
            acc.r += color.r;
            acc.g += color.g;
            acc.b += color.b;
            return acc;
        }, { r: 0, g: 0, b: 0 });
        
        avgColor.r = Math.round(avgColor.r / colors.length);
        avgColor.g = Math.round(avgColor.g / colors.length);
        avgColor.b = Math.round(avgColor.b / colors.length);
        
        // Create a slightly lighter and darker version for gradient
        const lighterColor = {
            r: Math.min(255, avgColor.r + 20),
            g: Math.min(255, avgColor.g + 20),
            b: Math.min(255, avgColor.b + 20)
        };
        
        const darkerColor = {
            r: Math.max(0, avgColor.r - 20),
            g: Math.max(0, avgColor.g - 20),
            b: Math.max(0, avgColor.b - 20)
        };
        
        // Apply gradient background
        const gradient = `linear-gradient(135deg, 
            rgb(${lighterColor.r}, ${lighterColor.g}, ${lighterColor.b}) 0%, 
            rgb(${darkerColor.r}, ${darkerColor.g}, ${darkerColor.b}) 100%)`;
        
        container.style.background = gradient;
        
    } catch (error) {
        console.error('Error extracting image colors:', error);
        // Fallback to default gradient
        container.style.background = 'linear-gradient(135deg, #d1d5db 0%, #e5e7eb 100%)';
    }
}
