import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "JanSeva AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "janseva-ai-secure-secret-key-2026")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./janseva.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini" if os.getenv("GEMINI_API_KEY") else "mock")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    ALLOW_ORIGINS: list[str] = ["*"]
    ENABLE_PLAYWRIGHT: bool = True

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
