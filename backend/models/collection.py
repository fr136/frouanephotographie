from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Collection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str
    description: str
    category: str
    coverImage: str
    photoCount: int = 0
    slug: str
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Calanques de Marseille",
                "subtitle": "Les joyaux cachés de la côte",
                "description": "Explorez la beauté sauvage des calanques...",
                "category": "calanques",
                "coverImage": "https://example.com/image.jpg",
                "slug": "calanques-marseille",
                "order": 1
            }
        }

class CollectionCreate(BaseModel):
    title: str
    subtitle: str
    description: str
    category: str
    coverImage: str
    slug: str
    order: int = 0

class CollectionUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    coverImage: Optional[str] = None
    photoCount: Optional[int] = None
    slug: Optional[str] = None
    order: Optional[int] = None
