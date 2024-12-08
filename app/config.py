from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./ai_content.db"
    secret_key: str = "your-secret-key"  # Change in production
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"

settings = Settings()