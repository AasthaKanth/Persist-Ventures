import aiohttp
import json
import os
from typing import List
import logging

logger = logging.getLogger(__name__)

class VideoGenerator:
    def __init__(self):
        # You can add multiple free video generation API endpoints here
        self.api_endpoints = [
            "https://api.free-video-gen.com/v1/generate",
            # Add more free API endpoints as backup
        ]
        
    async def generate_videos(self, prompt: str, num_videos: int = 5) -> List[str]:
        """Generate videos using available free APIs"""
        try:
            video_urls = []
            async with aiohttp.ClientSession() as session:
                for endpoint in self.api_endpoints:
                    if len(video_urls) >= num_videos:
                        break
                        
                    payload = {
                        "prompt": prompt,
                        "duration": 15,  # 15 seconds per video
                        "resolution": "720p"
                    }
                    
                    try:
                        async with session.post(endpoint, json=payload) as response:
                            if response.status == 200:
                                result = await response.json()
                                video_urls.extend(result.get("videos", []))
                    except Exception as e:
                        logger.error(f"Error with endpoint {endpoint}: {str(e)}")
                        continue
                        
            return video_urls[:num_videos]
            
        except Exception as e:
            logger.error(f"Error in generate_videos: {str(e)}")
            return []