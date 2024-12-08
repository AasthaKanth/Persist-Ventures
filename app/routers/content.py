from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os
from datetime import datetime

from .. import models, schemas
from ..database import get_db
from ..services.pollinations_ai import PollinationsAI
from ..services.video_generator import VideoGenerator
from .auth import get_current_user

router = APIRouter()
pollinations_ai = PollinationsAI()
video_generator = VideoGenerator()

@router.post("/generate/", response_model=schemas.Content)
async def generate_content(
    content: schemas.ContentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Create content entry with "Processing" status
    db_content = models.Content(
        user_id=current_user.id,
        prompt=content.prompt,
        video_paths=[],
        image_paths=[],
        status="Processing",
        notification_time=content.notification_time
    )
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    
    try:
        # Generate images and videos concurrently
        image_paths = await pollinations_ai.generate_images(content.prompt)
        video_paths = await video_generator.generate_videos(content.prompt)
        
        # Update content with generated paths
        db_content.image_paths = image_paths
        db_content.video_paths = video_paths
        db_content.status = "Completed"
        db_content.generated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_content)
        
        return db_content
    except Exception as e:
        db_content.status = "Failed"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/user/", response_model=List[schemas.Content])
def get_user_content(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Content).filter(
        models.Content.user_id == current_user.id
    ).all()