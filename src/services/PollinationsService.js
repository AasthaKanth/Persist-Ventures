import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

class PollinationsService {
  constructor() {
    this.baseUrl = 'https://image.pollinations.ai/prompt';
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async generateImages(prompt, userId, numImages = 5) {
    try {
      const imageUrls = [];
      const baseDir = path.join(process.cwd(), 'generated_content', userId.toString(), 'images');
      await this.ensureDirectoryExists(baseDir);

      for (let i = 1; i <= numImages; i++) {
        const seed = i * 12345; // Unique seed for variation
        const imageUrl = `${this.baseUrl}/${encodeURIComponent(prompt)}?seed=${seed}`;
        
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to generate image ${i}: ${response.statusText}`);
        }

        const imagePath = path.join(baseDir, `image_${i}.png`);
        const buffer = await response.buffer();
        await fs.writeFile(imagePath, buffer);

        // Store the relative path for database
        const relativePath = path.join('generated_content', userId.toString(), 'images', `image_${i}.png`);
        imageUrls.push(relativePath);
      }

      return imageUrls;
    } catch (error) {
      console.error('Error generating images:', error);
      return [];
    }
  }
}

export default new PollinationsService();