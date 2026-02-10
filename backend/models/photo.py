from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class PhotoLocation(BaseModel):
    name: Optional[str] = None
    coordinates: Optional[dict] = None  # {"lat": float, "lng": float}

class Photo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    collectionId: str
    imageUrl: str
    caption: Optional[str] = None  # À remplir plus tard
    location: Optional[PhotoLocation] = None  # À remplir plus tard
    dateTaken: Optional[datetime] = None
    camera: Optional[str] = None
    settings: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    order: int = 0
    featured: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Lumière Dorée sur la Calanque",
                "collectionId": "calanques-marseille",
                "imageUrl": "https://example.com/photo.jpg",
                "caption": "Le soleil couchant illumine...",
                "location": {
                    "name": "Calanque de Sormiou, Marseille",
                    "coordinates": {"lat": 43.2095, "lng": 5.4195}
                },
                "tags": ["calanques", "sunset", "marseille"],
                "order": 1
            }
        }

class PhotoCreate(BaseModel):
    title: str
    collectionId: str
    imageUrl: str
    caption: Optional[str] = None
    location: Optional[PhotoLocation] = None
    dateTaken: Optional[datetime] = None
    camera: Optional[str] = None
    settings: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    order: int = 0
    featured: bool = False

class PhotoUpdate(BaseModel):
    title: Optional[str] = None
    imageUrl: Optional[str] = None
    caption: Optional[str] = None
    location: Optional[PhotoLocation] = None
    dateTaken: Optional[datetime] = None
    camera: Optional[str] = None
    settings: Optional[str] = None
    tags: Optional[List[str]] = None
    order: Optional[int] = None
    featured: Optional[bool] = None
