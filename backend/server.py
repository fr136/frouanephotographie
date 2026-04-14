"""
Backend Franck Rouane Photographie
- Proxy sécurisé vers Prodigi API v4 (quotes, orders, status)
- Formulaire de contact (stockage + email optionnel)
- Newsletter (stockage)
"""

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import os
import logging
import httpx
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ─── Config ───
MONGO_URL = os.environ.get('MONGO_URL', '')
DB_NAME = os.environ.get('DB_NAME', 'frouane_photo')
PRODIGI_API_KEY = os.environ.get('PRODIGI_API_KEY', '')
PRODIGI_ENV = os.environ.get('PRODIGI_ENV', 'sandbox')  # 'sandbox' ou 'live'
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')

PRODIGI_BASE_URL = (
    'https://api.prodigi.com' if PRODIGI_ENV == 'live'
    else 'https://api.sandbox.prodigi.com'
)

# ─── MongoDB ───
client = None
db = None

# ─── App ───
app = FastAPI(title="Franck Rouane Photographie API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ─── Startup / Shutdown ───
@app.on_event("startup")
async def startup():
    global client, db
    if MONGO_URL:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        logger.info("MongoDB connected")
    else:
        logger.warning("MONGO_URL not set — DB features disabled")


@app.on_event("shutdown")
async def shutdown():
    if client:
        client.close()


# ═══════════════════════════════════════════
#  PRODIGI — SKU Mapping
# ═══════════════════════════════════════════

# Enhanced Matte Art Paper (GLOBAL-FAP) — giclée, 200gsm, qualité muséale
PRODIGI_SKUS = {
    '30x45 cm': 'GLOBAL-FAP-12x18',
    '50x75 cm': 'GLOBAL-FAP-20x30',
    '70x105 cm': 'GLOBAL-FAP-28x42',
    '100x150 cm': 'GLOBAL-FAP-40x60',
}


# ═══════════════════════════════════════════
#  PRODIGI — Quote
# ═══════════════════════════════════════════

class QuoteRequest(BaseModel):
    sku: str = Field(..., description="Prodigi SKU or size label like '30x45 cm'")
    country_code: str = Field(default="FR", description="ISO country code")
    shipping_method: str = Field(default="Standard")


class QuoteItem(BaseModel):
    size: str
    sku: str
    shipping_method: str
    cost_amount: Optional[str] = None
    cost_currency: Optional[str] = None
    shipping_amount: Optional[str] = None
    shipping_currency: Optional[str] = None


@api.post("/prodigi/quote", response_model=QuoteItem)
async def get_prodigi_quote(req: QuoteRequest):
    """Obtenir un devis Prodigi pour un tirage."""
    sku = PRODIGI_SKUS.get(req.sku, req.sku)

    async with httpx.AsyncClient() as client_http:
        resp = await client_http.post(
            f"{PRODIGI_BASE_URL}/v4.0/quotes",
            headers={
                "X-API-Key": PRODIGI_API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "shippingMethod": req.shipping_method,
                "destinationCountryCode": req.country_code,
                "items": [
                    {"sku": sku, "copies": 1, "attributes": {}}
                ]
            }
        )

    if resp.status_code != 200:
        logger.error(f"Prodigi quote error: {resp.text}")
        raise HTTPException(status_code=502, detail="Erreur devis Prodigi")

    data = resp.json()
    quotes = data.get("quotes", [])
    if not quotes:
        raise HTTPException(status_code=404, detail="Aucun devis disponible")

    q = quotes[0]
    cost = q.get("totalCost", {})
    shipping_cost = {}
    for item in q.get("shipmentItems", q.get("items", [])):
        if "shippingCost" in item:
            shipping_cost = item["shippingCost"]
            break

    return QuoteItem(
        size=req.sku,
        sku=sku,
        shipping_method=req.shipping_method,
        cost_amount=cost.get("amount"),
        cost_currency=cost.get("currency"),
        shipping_amount=shipping_cost.get("amount"),
        shipping_currency=shipping_cost.get("currency"),
    )


# ═══════════════════════════════════════════
#  PRODIGI — Create Order
# ═══════════════════════════════════════════

class OrderAddress(BaseModel):
    line1: str
    line2: Optional[str] = None
    postal_code: str
    country_code: str = "FR"
    city: str
    state: Optional[str] = None


class OrderRecipient(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: OrderAddress


class OrderItemRequest(BaseModel):
    sku: str = Field(..., description="Size label or Prodigi SKU")
    image_url: str = Field(..., description="URL publique de l'image haute résolution")
    copies: int = Field(default=1)
    merchant_reference: Optional[str] = None


class CreateOrderRequest(BaseModel):
    recipient: OrderRecipient
    items: List[OrderItemRequest]
    shipping_method: str = Field(default="Standard")
    merchant_reference: Optional[str] = None


class OrderResponse(BaseModel):
    order_id: str
    status: str
    merchant_reference: Optional[str] = None


@api.post("/prodigi/orders", response_model=OrderResponse)
async def create_prodigi_order(req: CreateOrderRequest):
    """Créer une commande de tirage via Prodigi."""
    items = []
    for item in req.items:
        sku = PRODIGI_SKUS.get(item.sku, item.sku)
        items.append({
            "sku": sku,
            "copies": item.copies,
            "sizing": "fillPrintArea",
            "merchantReference": item.merchant_reference or "",
            "assets": [
                {
                    "printArea": "default",
                    "url": item.image_url
                }
            ]
        })

    order_payload = {
        "shippingMethod": req.shipping_method,
        "merchantReference": req.merchant_reference or f"frouane-{uuid.uuid4().hex[:8]}",
        "recipient": {
            "name": req.recipient.name,
            "email": req.recipient.email,
            "phoneNumber": req.recipient.phone,
            "address": {
                "line1": req.recipient.address.line1,
                "line2": req.recipient.address.line2,
                "postalOrZipCode": req.recipient.address.postal_code,
                "countryCode": req.recipient.address.country_code,
                "townOrCity": req.recipient.address.city,
                "stateOrCounty": req.recipient.address.state,
            }
        },
        "items": items
    }

    async with httpx.AsyncClient() as client_http:
        resp = await client_http.post(
            f"{PRODIGI_BASE_URL}/v4.0/orders",
            headers={
                "X-API-Key": PRODIGI_API_KEY,
                "Content-Type": "application/json"
            },
            json=order_payload
        )

    if resp.status_code != 200:
        logger.error(f"Prodigi order error: {resp.text}")
        raise HTTPException(status_code=502, detail=f"Erreur commande Prodigi: {resp.text}")

    data = resp.json()
    order = data.get("order", {})

    # Sauvegarder en DB si disponible
    if db:
        await db.orders.insert_one({
            "prodigi_order_id": order.get("id"),
            "merchant_reference": order.get("merchantReference"),
            "recipient_name": req.recipient.name,
            "recipient_email": req.recipient.email,
            "status": order.get("status", {}).get("stage"),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "items": [{"sku": i.sku, "copies": i.copies} for i in req.items]
        })

    return OrderResponse(
        order_id=order.get("id", ""),
        status=order.get("status", {}).get("stage", "Unknown"),
        merchant_reference=order.get("merchantReference")
    )


# ═══════════════════════════════════════════
#  PRODIGI — Order Status
# ═══════════════════════════════════════════

@api.get("/prodigi/orders/{order_id}")
async def get_order_status(order_id: str):
    """Consulter le statut d'une commande Prodigi."""
    async with httpx.AsyncClient() as client_http:
        resp = await client_http.get(
            f"{PRODIGI_BASE_URL}/v4.0/orders/{order_id}",
            headers={"X-API-Key": PRODIGI_API_KEY}
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="Commande introuvable")

    data = resp.json()
    order = data.get("order", {})
    return {
        "order_id": order.get("id"),
        "status": order.get("status"),
        "shipments": order.get("shipments", []),
        "charges": order.get("charges", [])
    }


# ═══════════════════════════════════════════
#  CONTACT
# ═══════════════════════════════════════════

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


@api.post("/contact")
async def submit_contact(msg: ContactMessage):
    """Enregistrer un message de contact."""
    doc = {
        "id": str(uuid.uuid4()),
        "name": msg.name,
        "email": msg.email,
        "phone": msg.phone,
        "subject": msg.subject,
        "message": msg.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "read": False
    }

    if db:
        await db.contact_messages.insert_one(doc)
        logger.info(f"Contact message saved: {msg.name} <{msg.email}>")
    else:
        logger.info(f"Contact message (no DB): {msg.name} <{msg.email}> — {msg.subject}")

    return {"success": True, "message": "Message reçu"}


# ═══════════════════════════════════════════
#  NEWSLETTER
# ═══════════════════════════════════════════

class NewsletterSubscription(BaseModel):
    email: EmailStr


@api.post("/newsletter/subscribe")
async def subscribe_newsletter(sub: NewsletterSubscription):
    """Inscription newsletter."""
    if db:
        existing = await db.newsletter.find_one({"email": sub.email})
        if existing:
            return {"success": True, "message": "Déjà inscrit"}
        await db.newsletter.insert_one({
            "email": sub.email,
            "subscribed_at": datetime.now(timezone.utc).isoformat()
        })

    return {"success": True, "message": "Inscription confirmée"}


# ═══════════════════════════════════════════
#  HEALTH
# ═══════════════════════════════════════════

@api.get("/health")
async def health():
    return {
        "status": "ok",
        "prodigi_env": PRODIGI_ENV,
        "db_connected": db is not None
    }


# ─── Mount & CORS ───
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)
