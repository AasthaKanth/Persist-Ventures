import fetch from 'node-fetch';

class VideoService {
  constructor() {
    this.apiEndpoints = [
      'https://api.free-video-gen.com/v1/generate'
    ];
  }

  async generateVideos(prompt, numVideos = 5) {
    const videoUrls = [];
    
    for (const endpoint of this.apiEndpoints) {
      if (videoUrls.length >= numVideos) break;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            duration: 15,
            resolution: '720p'
          })
        });

        if (response.ok) {
          const data = await response.json();
          videoUrls.push(...(data.videos || []));
        }
      } catch (error) {
        console.error(`Error with video endpoint ${endpoint}:`, error);
      }
    }

    return videoUrls.slice(0, numVideos);
  }
}

export default new VideoService();