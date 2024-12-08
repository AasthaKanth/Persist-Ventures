from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    contents = relationship("Content", back_populates="owner")

class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    prompt = Column(String)
    video_paths = Column(JSON)
    image_paths = Column(JSON)
    status = Column(String)  # "Processing" or "Completed"
    notification_time = Column(DateTime)
    generated_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="contents")