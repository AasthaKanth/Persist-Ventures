from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        orm_mode = True

class ContentBase(BaseModel):
    prompt: str
    notification_time: Optional[datetime] = None

class ContentCreate(ContentBase):
    pass

class Content(ContentBase):
    id: int
    user_id: int
    video_paths: List[str]
    image_paths: List[str]
    status: str
    generated_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str