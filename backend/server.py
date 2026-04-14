"""
Backend Franck Rouane Photographie
- Proxy sécurisé vers Prodigi API v4 (quotes, orders, status)
- Stripe Checkout (paiement avant commande Prodigi)
- Formulaire de contact (stockage + email optionnel)
- Newsletter (stockage)
"""

from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import os
import logging
import httpx
import uuid
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ─── Config ───
MONGO_URL = os.environ.get('MONGO_URL', '')
DB_NAME = os.environ.get('DB_NAME', 'frouane_photo')
PRODIGI_API_KEY = os.environ.get('PRODIGI_API_KEY', '')
PRODIGI_ENV = os.environ.get('PRODIGI_ENV', 'sandbox')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')

PRODIGI_BASE_URL = (
    'https://api.prodigi.com' if PRODIGI_ENV == 'live'
    else 'https://api.sandbox.prodigi.com'
)

# Stripe (import conditionnel)
stripe = None
try:
    import stripe as stripe_lib
    if STRIPE_SECRET_KEY:
        stripe_lib.api_key = STRIPE_SECRET_KEY
        stripe = stripe_lib
        logging.info("Stripe configured")
except ImportError:
    logging.warning("stripe package not installed — payment disabled")

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
#  STRIPE CHECKOUT
# ═══════════════════════════════════════════

class CheckoutItem(BaseModel):
    title: str
    size: str
    image_url: str
    price: int = Field(..., description="Prix en centimes (ex: 18000 pour 180€)")
    quantity: int = Field(default=1)


class CheckoutRequest(BaseModel):
    items: List[CheckoutItem]
    customer_email: Optional[str] = None


@api.post("/checkout/create-session")
async def create_checkout_session(req: CheckoutRequest):
    """Créer une session Stripe Checkout."""
    if not stripe:
        raise HTTPException(status_code=503, detail="Paiement non configuré")

    line_items = []
    for item in req.items:
        line_items.append({
            "price_data": {
                "currency": "eur",
                "unit_amount": item.price,
                "product_data": {
                    "name": f"{item.title} — {item.size}",
                    "description": f"Tirage Fine Art, édition limitée",
                    "images": [item.image_url] if item.image_url.startswith("http") else [],
                },
            },
            "quantity": item.quantity,
        })

    # Stocker les metadata pour le webhook
    metadata = {
        "items": json.dumps([
            {"title": i.title, "size": i.size, "image_url": i.image_url, "quantity": i.quantity}
            for i in req.items
        ])
    }

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{FRONTEND_URL}/commande/confirmation?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/boutique",
            customer_email=req.customer_email,
            metadata=metadata,
            shipping_address_collection={
                "allowed_countries": [
                    "FR", "BE", "CH", "LU", "MC", "DE", "IT", "ES", "PT",
                    "NL", "AT", "GB", "IE", "DK", "SE", "NO", "FI",
                ],
            },
        )
        return {"session_id": session.id, "url": session.url}

    except Exception as e:
        logger.error(f"Stripe checkout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api.get("/checkout/session/{session_id}")
async def get_checkout_session(session_id: str):
    """Récupérer les détails d'une session Checkout (confirmation page)."""
    if not stripe:
        raise HTTPException(status_code=503, detail="Paiement non configuré")
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            "status": session.payment_status,
            "customer_email": session.customer_details.email if session.customer_details else None,
            "amount_total": session.amount_total,
            "currency": session.currency,
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Session introuvable")


@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Webhook Stripe : déclenché après paiement réussi.
    Crée automatiquement la commande Prodigi.
    Cet endpoint est sur app (pas api) pour éviter le prefix /api.
    """
    if not stripe or not STRIPE_WEBHOOK_SECRET:
        return JSONResponse(status_code=400, content={"error": "Webhook not configured"})

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.error(f"Webhook signature invalid: {e}")
        return JSONResponse(status_code=400, content={"error": "Invalid signature"})

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        logger.info(f"Payment completed: {session['id']}")

        # Extraire les données
        shipping = session.get("shipping_details", {})
        address = shipping.get("address", {})
        items_json = session.get("metadata", {}).get("items", "[]")

        try:
            items_data = json.loads(items_json)
        except json.JSONDecodeError:
            items_data = []

        # Créer la commande Prodigi
        if items_data and PRODIGI_API_KEY:
            prodigi_items = []
            for item in items_data:
                sku = PRODIGI_SKUS.get(item.get("size", ""), item.get("size", ""))
                prodigi_items.append({
                    "sku": sku,
                    "copies": item.get("quantity", 1),
                    "sizing": "fillPrintArea",
                    "assets": [{"printArea": "default", "url": item.get("image_url", "")}]
                })

            order_payload = {
                "shippingMethod": "Standard",
                "merchantReference": f"stripe-{session['id'][:20]}",
                "recipient": {
                    "name": shipping.get("name", ""),
                    "email": session.get("customer_details", {}).get("email"),
                    "address": {
                        "line1": address.get("line1", ""),
                        "line2": address.get("line2"),
                        "postalOrZipCode": address.get("postal_code", ""),
                        "countryCode": address.get("country", "FR"),
                        "townOrCity": address.get("city", ""),
                        "stateOrCounty": address.get("state"),
                    }
                },
                "items": prodigi_items
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

            if resp.status_code == 200:
                prodigi_order = resp.json().get("order", {})
                logger.info(f"Prodigi order created: {prodigi_order.get('id')}")

                # Sauvegarder en DB
                if db:
                    await db.orders.insert_one({
                        "stripe_session_id": session["id"],
                        "prodigi_order_id": prodigi_order.get("id"),
                        "customer_email": session.get("customer_details", {}).get("email"),
                        "amount": session.get("amount_total"),
                        "currency": session.get("currency"),
                        "status": "paid_and_ordered",
                        "created_at": datetime.now(timezone.utc).isoformat(),
                        "items": items_data,
                    })
            else:
                logger.error(f"Prodigi order failed: {resp.text}")
                if db:
                    await db.orders.insert_one({
                        "stripe_session_id": session["id"],
                        "prodigi_error": resp.text,
                        "status": "paid_prodigi_failed",
                        "created_at": datetime.now(timezone.utc).isoformat(),
                        "items": items_data,
                    })

    return JSONResponse(status_code=200, content={"received": True})


# ═══════════════════════════════════════════
#  HEALTH
# ═══════════════════════════════════════════

@api.get("/health")
async def health():
    return {
        "status": "ok",
        "prodigi_env": PRODIGI_ENV,
        "db_connected": db is not None,
        "stripe_configured": stripe is not None,
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
