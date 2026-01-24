from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Try POSTGRES_URL first (Vercel default), then DATABASE_URL, then local default
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/cyber_fashion"
    
    # On Vercel, use the provided POSTGRES_URL if available
    @property
    def sync_database_url(self) -> str:
        import os
        return os.getenv("POSTGRES_URL", os.getenv("DATABASE_URL", self.DATABASE_URL))

    SECRET_KEY: str = "your-secret-key-change-this-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
