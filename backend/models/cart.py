from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    photoId: str
    photoTitle: str
    photoImage: str
    format: str  # "30x40cm", "50x70cm", etc.
    price: float
    quantity: int = 1

class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sessionId: str
    items: List[CartItem] = Field(default_factory=list)
    total: float = 0.0
    promoCode: Optional[str] = None
    discount: float = 0.0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class CartItemCreate(BaseModel):
    photoId: str
    format: str
    quantity: int = 1

class PromoCode(BaseModel):
    code: str
    discount: float  # percentage
    active: bool = True
    usageLimit: Optional[int] = None
    usageCount: int = 0
    expiresAt: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
