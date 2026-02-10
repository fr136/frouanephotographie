from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

class WishlistItem(BaseModel):
    photoId: str
    photoTitle: str
    photoImage: str
    addedAt: datetime = Field(default_factory=datetime.utcnow)

class Wishlist(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sessionId: str
    items: List[WishlistItem] = Field(default_factory=list)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class NewsletterSubscriber(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    promoCode: str
    used: bool = False
    subscribedAt: datetime = Field(default_factory=datetime.utcnow)
    source: str = "popup"  # popup, footer, etc.

class NewsletterSubscribe(BaseModel):
    email: EmailStr
