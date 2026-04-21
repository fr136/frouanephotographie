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
from typing import Dict, List, Optional
import os
import logging
import httpx
import uuid
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

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
BLOB_READ_WRITE_TOKEN = os.environ.get('BLOB_READ_WRITE_TOKEN', '')
PRINT_ASSET_CATALOG_PATH = ROOT_DIR.parent / 'frontend' / 'src' / 'data' / 'printAssetCatalog.json'

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

SIZE_PRICE_OFFSETS = {
    '30x45 cm': 0,
    '50x75 cm': 40,
    '70x105 cm': 80,
    '100x150 cm': 150,
}

PRODUCT_CATALOG = {
    'cal-001': {
        'title': 'Sormiou - Vue Panoramique',
        'base_price_eur': 150,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Calanques/Calanque Sormiou 2.webp',
    },
    'cal-002': {
        'title': 'Port de Cassis',
        'base_price_eur': 120,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Calanques/Port de cassis.webp',
    },
    'cal-003': {
        'title': 'Calanque des Anglais',
        'base_price_eur': 130,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Calanques/Calanque des anglais.webp',
    },
    'cal-004': {
        'title': "Port d'Alon",
        'base_price_eur': 140,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': "/Calanques/Calanque Port d'alon Saint Cyr sur mer.webp",
    },
    'cal-005': {
        'title': 'Sormiou au Crepuscule',
        'base_price_eur': 160,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Calanques/Sormiou.webp',
    },
    'cal-006': {
        'title': 'Calanque Agay',
        'base_price_eur': 130,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Calanques/Calanque-agay.webp',
    },
    'sun-001': {
        'title': 'La Ciotat - Route des Cretes',
        'base_price_eur': 180,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm', '100x150 cm'],
        'asset_path': '/Sunset/Coucher de soleil La Ciotat éléphant routedes crêtes.webp',
    },
    'sun-002': {
        'title': 'Ciel de Feu',
        'base_price_eur': 170,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Sunset/sunset fire la ciotat.webp',
    },
    'sun-003': {
        'title': 'Catalans - Marseille',
        'base_price_eur': 140,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Sunset/Sunset catalans marseille.webp',
    },
    'sun-004': {
        'title': "L'Estaque",
        'base_price_eur': 150,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': "/Sunset/sunset l'estaque Marseille.webp",
    },
    'sun-005': {
        'title': 'Port Saint-Jean',
        'base_price_eur': 130,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Sunset/sunset port saintjean la ciotat.webp',
    },
    'sun-006': {
        'title': 'Bain des Dames',
        'base_price_eur': 140,
        'sizes': ['30x45 cm', '50x75 cm', '70x105 cm'],
        'asset_path': '/Sunset/sunset serpent bain des dames marseille.webp',
    },
}

ORDER_STATUS_CACHE: Dict[str, Dict[str, Optional[str]]] = {}


def is_public_http_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
    except Exception:
        return False

    if parsed.scheme not in ('http', 'https') or not parsed.netloc:
        return False

    hostname = parsed.hostname or ''
    return hostname not in {'localhost', '127.0.0.1', '0.0.0.0'}


def load_print_asset_catalog() -> dict:
    try:
        return json.loads(PRINT_ASSET_CATALOG_PATH.read_text(encoding='utf8'))
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Catalogue Vercel Blob introuvable")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Catalogue Vercel Blob invalide")


def get_catalog_product(product_id: str) -> dict:
    product = PRODUCT_CATALOG.get(product_id)
    if not product:
        raise HTTPException(status_code=400, detail=f"Produit inconnu: {product_id}")
    return product


def get_product_print_asset(product_id: str) -> dict:
    asset = load_print_asset_catalog().get(product_id)

    if not asset:
        raise HTTPException(status_code=500, detail=f"Catalogue Blob manquant pour {product_id}")

    blob_url = (asset.get('blobUrl') or '').strip()
    if not blob_url:
        if not BLOB_READ_WRITE_TOKEN:
            raise HTTPException(status_code=503, detail="Vercel Blob non configure")
        raise HTTPException(status_code=503, detail=f"URL Blob manquante pour {product_id}")

    if not is_public_http_url(blob_url):
        raise HTTPException(status_code=503, detail=f"URL Blob invalide pour {product_id}")

    return asset


def get_catalog_product_from_image_url(image_url: str) -> tuple[str, dict]:
    parsed = urlparse(image_url)
    image_path = parsed.path.rstrip('/')
    print_assets = load_print_asset_catalog()

    for product_id, asset in print_assets.items():
        blob_url = (asset.get('blobUrl') or '').strip()
        blob_path = f"/{(asset.get('blobPathname') or '').lstrip('/')}".rstrip('/')

        if blob_url == image_url or blob_path == image_path:
            return product_id, get_catalog_product(product_id)

    for product_id, product in PRODUCT_CATALOG.items():
        if product['asset_path'] == image_path:
            return product_id, product

    raise HTTPException(status_code=400, detail=f"Asset produit inconnu: {image_url}")


def get_checkout_unit_amount(product_id: str, size: str) -> int:
    product = get_catalog_product(product_id)

    if size not in product['sizes']:
        raise HTTPException(
            status_code=400,
            detail=f"Format indisponible pour {product_id}: {size}",
        )

    if size not in SIZE_PRICE_OFFSETS:
        raise HTTPException(status_code=400, detail=f"Format non supporte: {size}")

    return (product['base_price_eur'] + SIZE_PRICE_OFFSETS[size]) * 100


def update_checkout_status_cache(
    session_id: str,
    *,
    order_status: str,
    prodigi_order_id: Optional[str] = None,
    order_error: Optional[str] = None,
) -> None:
    ORDER_STATUS_CACHE[session_id] = {
        'order_status': order_status,
        'prodigi_order_id': prodigi_order_id,
        'order_error': order_error,
    }


def update_stripe_session_metadata(
    session_id: str,
    session_metadata: dict,
    *,
    order_status: str,
    prodigi_order_id: Optional[str] = None,
    order_error: Optional[str] = None,
) -> None:
    if not stripe:
        return

    next_metadata = dict(session_metadata or {})
    next_metadata['order_status'] = order_status

    if prodigi_order_id:
        next_metadata['prodigi_order_id'] = prodigi_order_id
    else:
        next_metadata.pop('prodigi_order_id', None)

    if order_error:
        next_metadata['order_error'] = order_error[:500]
    else:
        next_metadata.pop('order_error', None)

    try:
        stripe.checkout.Session.modify(session_id, metadata=next_metadata)
    except Exception as exc:
        logger.warning("Stripe session metadata update failed for %s: %s", session_id, exc)


def read_obj_value(obj, key: str, default=None):
    if obj is None:
        return default

    if hasattr(obj, 'get'):
        value = obj.get(key, default)
        if value is not None:
            return value

    return getattr(obj, key, default)


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
    if not PRODIGI_API_KEY:
        raise HTTPException(status_code=503, detail="Prodigi non configure")

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
    if not PRODIGI_API_KEY:
        raise HTTPException(status_code=503, detail="Prodigi non configure")

    items = []
    for item in req.items:
        if not is_public_http_url(item.image_url):
            raise HTTPException(status_code=400, detail="image_url doit etre une URL publique")
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
    if not PRODIGI_API_KEY:
        raise HTTPException(status_code=503, detail="Prodigi non configure")

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
    product_id: Optional[str] = None
    size: str
    title: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[int] = None
    quantity: int = Field(default=1, ge=1, le=5)


class CheckoutRequest(BaseModel):
    items: List[CheckoutItem]
    customer_email: Optional[str] = None


@api.post("/checkout/create-session")
async def create_checkout_session(req: CheckoutRequest):
    """Créer une session Stripe Checkout."""
    if not stripe:
        raise HTTPException(status_code=503, detail="Paiement non configure")
    if not PRODIGI_API_KEY:
        raise HTTPException(status_code=503, detail="Prodigi non configure")

    line_items = []
    metadata_items = []
    for item in req.items:
        product_id = item.product_id

        if product_id:
            product = get_catalog_product(product_id)
        elif item.image_url:
            product_id, product = get_catalog_product_from_image_url(item.image_url)
        else:
            raise HTTPException(
                status_code=400,
                detail="product_id ou image_url est requis pour le checkout",
            )

        unit_amount = get_checkout_unit_amount(product_id, item.size)
        print_asset = get_product_print_asset(product_id)
        image_url = print_asset['blobUrl']

        line_items.append({
            "price_data": {
                "currency": "eur",
                "unit_amount": unit_amount,
                "product_data": {
                    "name": f"{product['title']} — {item.size}",
                    "description": f"Tirage Fine Art, édition limitée",
                    "images": [image_url],
                },
            },
            "quantity": item.quantity,
        })
        metadata_items.append({
            "product_id": product_id,
            "title": product['title'],
            "size": item.size,
            "image_url": image_url,
            "unit_amount": unit_amount,
            "quantity": item.quantity,
        })

    # Stocker les metadata pour le webhook
    metadata = {
        "items": json.dumps(metadata_items),
        "order_status": "checkout_created",
    }

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{FRONTEND_URL}/commande/confirmation?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/boutique?checkout=cancelled",
            customer_email=req.customer_email,
            metadata=metadata,
            shipping_address_collection={
                "allowed_countries": [
                    "FR", "BE", "CH", "LU", "MC", "DE", "IT", "ES", "PT",
                    "NL", "AT", "GB", "IE", "DK", "SE", "NO", "FI",
                ],
            },
        )
        update_checkout_status_cache(session.id, order_status="checkout_created")
        return {"session_id": session.id, "url": session.url}

    except Exception as e:
        logger.error(f"Stripe checkout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api.get("/checkout/session/{session_id}")
async def get_checkout_session(session_id: str):
    """Récupérer les détails d'une session Checkout (confirmation page)."""
    if not stripe:
        raise HTTPException(status_code=503, detail="Paiement non configure")
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        metadata = session.get("metadata", {}) or {}
        order_status = metadata.get("order_status")
        prodigi_order_id = metadata.get("prodigi_order_id")
        order_error = metadata.get("order_error")
        customer_details = read_obj_value(session, "customer_details", {}) or {}

        cached_order = ORDER_STATUS_CACHE.get(session_id)
        if cached_order:
            order_status = cached_order.get("order_status") or order_status
            prodigi_order_id = cached_order.get("prodigi_order_id") or prodigi_order_id
            order_error = cached_order.get("order_error") or order_error

        if db:
            db_order = await db.orders.find_one({"stripe_session_id": session_id})
            if db_order:
                order_status = db_order.get("status", order_status)
                prodigi_order_id = db_order.get("prodigi_order_id", prodigi_order_id)
                order_error = db_order.get("prodigi_error", order_error)

        return {
            "status": read_obj_value(session, "payment_status"),
            "customer_email": read_obj_value(customer_details, "email"),
            "amount_total": read_obj_value(session, "amount_total"),
            "currency": read_obj_value(session, "currency"),
            "order_status": order_status,
            "prodigi_order_id": prodigi_order_id,
            "order_error": order_error,
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

        if not items_data:
            update_checkout_status_cache(
                session["id"],
                order_status="prodigi_failed",
                order_error="Aucun article valide dans la session Stripe",
            )
            update_stripe_session_metadata(
                session["id"],
                session.get("metadata", {}),
                order_status="prodigi_failed",
                order_error="Aucun article valide dans la session Stripe",
            )
            return JSONResponse(status_code=200, content={"received": True})

        if not PRODIGI_API_KEY:
            update_checkout_status_cache(
                session["id"],
                order_status="prodigi_failed",
                order_error="Prodigi non configure",
            )
            update_stripe_session_metadata(
                session["id"],
                session.get("metadata", {}),
                order_status="prodigi_failed",
                order_error="Prodigi non configure",
            )
            return JSONResponse(status_code=200, content={"received": True})

        # Créer la commande Prodigi
        if items_data and PRODIGI_API_KEY:
            prodigi_items = []
            for item in items_data:
                image_url = (item.get("image_url") or "").strip()
                if not is_public_http_url(image_url):
                    update_checkout_status_cache(
                        session["id"],
                        order_status="prodigi_failed",
                        order_error="URL image d'impression invalide",
                    )
                    update_stripe_session_metadata(
                        session["id"],
                        session.get("metadata", {}),
                        order_status="prodigi_failed",
                        order_error="URL image d'impression invalide",
                    )
                    return JSONResponse(status_code=200, content={"received": True})

                sku = PRODIGI_SKUS.get(item.get("size", ""), item.get("size", ""))
                prodigi_items.append({
                    "sku": sku,
                    "copies": item.get("quantity", 1),
                    "sizing": "fillPrintArea",
                    "assets": [{"printArea": "default", "url": image_url}]
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
                update_checkout_status_cache(
                    session["id"],
                    order_status="submitted_to_prodigi",
                    prodigi_order_id=prodigi_order.get("id"),
                )
                update_stripe_session_metadata(
                    session["id"],
                    session.get("metadata", {}),
                    order_status="submitted_to_prodigi",
                    prodigi_order_id=prodigi_order.get("id"),
                )

                # Sauvegarder en DB
                if db:
                    await db.orders.insert_one({
                        "stripe_session_id": session["id"],
                        "prodigi_order_id": prodigi_order.get("id"),
                        "customer_email": session.get("customer_details", {}).get("email"),
                        "amount": session.get("amount_total"),
                        "currency": session.get("currency"),
                        "status": "submitted_to_prodigi",
                        "created_at": datetime.now(timezone.utc).isoformat(),
                        "items": items_data,
                    })
            else:
                logger.error(f"Prodigi order failed: {resp.text}")
                update_checkout_status_cache(
                    session["id"],
                    order_status="prodigi_failed",
                    order_error=resp.text,
                )
                update_stripe_session_metadata(
                    session["id"],
                    session.get("metadata", {}),
                    order_status="prodigi_failed",
                    order_error=resp.text,
                )
                if db:
                    await db.orders.insert_one({
                        "stripe_session_id": session["id"],
                        "prodigi_error": resp.text,
                        "status": "prodigi_failed",
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
