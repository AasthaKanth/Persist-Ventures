import aiohttp
import json
import os
from typing import List
import logging

logger = logging.getLogger(__name__)

class PollinationsAI:
    def __init__(self):
        self.base_url = "https://api.pollinations.ai/v1"
        
    async def generate_images(self, prompt: str, num_images: int = 5) -> List[str]:
        """Generate images using Pollinations.ai API"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "prompt": prompt,
                    "negative_prompt": "ugly, blurry, low quality",
                    "num_images": num_images,
                    "width": 512,
                    "height": 512
                }
                
                async with session.post(
                    f"{self.base_url}/imagine/image", 
                    json=payload
                ) as response:
                    if response.status != 200:
                        logger.error(f"Error generating images: {await response.text()}")
                        return []
                    
                    result = await response.json()
                    return result.get("images", [])
                    
        except Exception as e:
            logger.error(f"Error in generate_images: {str(e)}")
            return []