from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Try POSTGRES_URL first (Vercel default), then DATABASE_URL, then local default
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/modern_fashion"
    
    # On Vercel, use the provided POSTGRES_URL if available
    @property
    def sync_database_url(self) -> str:
        import os
        postgres_url = os.getenv("POSTGRES_URL")
        database_url = os.getenv("DATABASE_URL")
        
        if postgres_url:
            print("CONFIG: Using POSTGRES_URL")
            return postgres_url
        if database_url:
            print(f"CONFIG: Using DATABASE_URL (Starts with: {database_url[:10]}...)")
            return database_url
            
        print("CONFIG: Using Default Localhost URL")
        return self.DATABASE_URL

    SECRET_KEY: str = "your-secret-key-change-this-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_ORIGINS: List[str] = ["*"]

    # Email Settings
    SMTP_SERVER: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@modern-store.com"
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
