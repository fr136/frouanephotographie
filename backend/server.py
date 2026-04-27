"""
Backend Franck Rouane Photographie
- Proxy sÃ©curisÃ© vers Prodigi API v4 (quotes, orders, status)
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

# â”€â”€â”€ Config â”€â”€â”€
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
PRODUCT_CATALOG_PATH = ROOT_DIR.parent / 'frontend' / 'src' / 'data' / 'productCatalog.json'

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
    logging.warning("stripe package not installed â€” payment disabled")

# â”€â”€â”€ MongoDB â”€â”€â”€
client = None
db = None

# â”€â”€â”€ App â”€â”€â”€
app = FastAPI(title="Franck Rouane Photographie API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# â”€â”€â”€ Startup / Shutdown â”€â”€â”€
@app.on_event("startup")
async def startup():
    global client, db
    if MONGO_URL:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        logger.info("MongoDB connected")
    else:
        logger.warning("MONGO_URL not set â€” DB features disabled")


@app.on_event("shutdown")
async def shutdown():
    if client:
        client.close()


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  PRODIGI â€” SKU Mapping
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

# Enhanced Matte Art Paper (GLOBAL-FAP) â€” giclÃ©e, 200gsm, qualitÃ© musÃ©ale
PRODIGI_SKUS = {
    '20x30 cm': 'GLOBAL-FAP-8x12',
    '30x40 cm': 'GLOBAL-FAP-12x16',
    '30x45 cm': 'GLOBAL-FAP-12x18',
    '40x60 cm': 'GLOBAL-FAP-16x24',
    '50x70 cm': 'GLOBAL-FAP-20x28',
}

SIZE_PRICE_OFFSETS = {
    '20x30 cm': 0,
    '30x40 cm': 0,
    '30x45 cm': 0,
    '40x60 cm': 40,
    '50x70 cm': 90,
}

def load_product_catalog() -> dict:
    try:
        raw_catalog = json.loads(PRODUCT_CATALOG_PATH.read_text(encoding='utf8'))
    except FileNotFoundError as exc:
        raise RuntimeError("Catalogue produit introuvable") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Catalogue produit invalide") from exc

    if not isinstance(raw_catalog, dict):
        raise RuntimeError("Catalogue produit invalide")

    return raw_catalog


PRODUCT_CATALOG = load_product_catalog()

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


def build_public_asset_url(path_or_url: str) -> str:
    candidate = (path_or_url or '').strip()

    if not candidate:
        return ''

    if is_public_http_url(candidate):
        return candidate

    if candidate.startswith('/'):
        absolute_url = f"{FRONTEND_URL.rstrip('/')}{candidate}"
        if is_public_http_url(absolute_url):
            return absolute_url

    return ''


def resolve_product_asset_url(product: dict, asset: dict) -> str:
    for candidate in (
        (asset.get('blobUrl') or '').strip(),
        build_public_asset_url(asset.get('previewImage') or ''),
        build_public_asset_url(product.get('asset_path') or ''),
    ):
        if is_public_http_url(candidate):
            return candidate

    return ''


def get_catalog_product(product_id: str) -> dict:
    product = PRODUCT_CATALOG.get(product_id)
    if not product:
        raise HTTPException(status_code=400, detail=f"Produit inconnu: {product_id}")
    return product


def get_product_print_asset(product_id: str) -> dict:
    product = get_catalog_product(product_id)
    asset = load_print_asset_catalog().get(product_id)

    if not asset:
        raise HTTPException(status_code=500, detail=f"Catalogue Blob manquant pour {product_id}")

    if not (asset.get('sourceFilePath') or '').strip():
        raise HTTPException(status_code=500, detail=f"sourceFilePath manquant pour {product_id}")

    if not (asset.get('previewImage') or product.get('asset_path') or '').strip():
        raise HTTPException(status_code=500, detail=f"previewImage manquant pour {product_id}")

    resolved_url = resolve_product_asset_url(product, asset)
    if not resolved_url:
        raise HTTPException(status_code=503, detail=f"URL d'impression introuvable pour {product_id}")

    return {
        **asset,
        'resolvedUrl': resolved_url,
    }


def get_catalog_product_from_image_url(image_url: str) -> tuple[str, dict]:
    parsed = urlparse(image_url)
    image_path = parsed.path.rstrip('/')
    print_assets = load_print_asset_catalog()

    for product_id, asset in print_assets.items():
        product = PRODUCT_CATALOG.get(product_id)
        blob_url = (asset.get('blobUrl') or '').strip()
        blob_path = f"/{(asset.get('blobPathname') or '').lstrip('/')}".rstrip('/')
        preview_image = (asset.get('previewImage') or '').rstrip('/')
        resolved_url = resolve_product_asset_url(product or {}, asset) if product else ''

        if (
            blob_url == image_url
            or resolved_url == image_url
            or blob_path == image_path
            or preview_image == image_path
            or (product or {}).get('asset_path', '').rstrip('/') == image_path
        ):
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


def get_checkout_customer_email(session, fallback: Optional[str] = None) -> Optional[str]:
    customer_details = read_obj_value(session, "customer_details", {}) or {}
    return (
        read_obj_value(customer_details, "email")
        or read_obj_value(session, "customer_email")
        or fallback
    )


async def upsert_checkout_record(
    session_id: str,
    *,
    order_status: str,
    payment_status: Optional[str] = None,
    customer_email: Optional[str] = None,
    amount_total: Optional[int] = None,
    currency: Optional[str] = None,
    items: Optional[list] = None,
    prodigi_order_id: Optional[str] = None,
    order_error: Optional[str] = None,
) -> None:
    if not db:
        return

    now = datetime.now(timezone.utc).isoformat()
    set_fields = {
        "status": order_status,
        "updated_at": now,
    }

    if payment_status is not None:
        set_fields["payment_status"] = payment_status

    if customer_email is not None:
        set_fields["customer_email"] = customer_email

    if amount_total is not None:
        set_fields["amount_total"] = amount_total
        set_fields["amount"] = amount_total

    if currency is not None:
        set_fields["currency"] = currency

    if items is not None:
        set_fields["items"] = items

    if prodigi_order_id is not None:
        set_fields["prodigi_order_id"] = prodigi_order_id

    if order_error is not None:
        set_fields["prodigi_error"] = order_error[:500]

    await db.orders.update_one(
        {"stripe_session_id": session_id},
        {
            "$set": set_fields,
            "$setOnInsert": {
                "stripe_session_id": session_id,
                "created_at": now,
            },
        },
        upsert=True,
    )


async def get_checkout_record(session_id: str) -> Optional[dict]:
    if not db:
        return None

    return await db.orders.find_one(
        {"stripe_session_id": session_id},
        sort=[("updated_at", -1), ("created_at", -1)],
    )


def serialize_checkout_record(record: dict) -> dict:
    return {
        "status": record.get("payment_status") or "unpaid",
        "customer_email": record.get("customer_email"),
        "amount_total": record.get("amount_total", record.get("amount")),
        "currency": record.get("currency"),
        "order_status": record.get("status"),
        "prodigi_order_id": record.get("prodigi_order_id"),
        "order_error": record.get("prodigi_error"),
    }


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  PRODIGI â€” Quote
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  PRODIGI â€” Create Order
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
    image_url: str = Field(..., description="URL publique de l'image haute rÃ©solution")
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
    """CrÃ©er une commande de tirage via Prodigi."""
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


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  PRODIGI â€” Order Status
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  CONTACT
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
        logger.info(f"Contact message (no DB): {msg.name} <{msg.email}> â€” {msg.subject}")

    return {"success": True, "message": "Message reçu"}


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  NEWSLETTER
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  STRIPE CHECKOUT
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
    """CrÃ©er une session Stripe Checkout."""
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
        image_url = print_asset['resolvedUrl']

        line_items.append({
            "price_data": {
                "currency": "eur",
                "unit_amount": unit_amount,
                "product_data": {
                    "name": f"{product['title']} â€” {item.size}",
                    "description": "Tirage Fine Art, édition limitée",
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
        await upsert_checkout_record(
            session.id,
            order_status="checkout_created",
            payment_status=read_obj_value(session, "payment_status") or "unpaid",
            customer_email=req.customer_email,
            amount_total=read_obj_value(session, "amount_total"),
            currency=read_obj_value(session, "currency"),
            items=metadata_items,
        )
        return {"session_id": session.id, "url": session.url}

    except Exception as e:
        logger.error(f"Stripe checkout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api.get("/checkout/session/{session_id}")
async def get_checkout_session(session_id: str):
    """RÃ©cupÃ©rer les dÃ©tails d'une session Checkout (confirmation page)."""
    if not stripe:
        raise HTTPException(status_code=503, detail="Paiement non configure")
    normalized_session_id = session_id.strip()
    if not normalized_session_id:
        raise HTTPException(status_code=400, detail="session_id invalide")

    db_order = await get_checkout_record(normalized_session_id)

    try:
        session = stripe.checkout.Session.retrieve(normalized_session_id)
    except stripe.error.InvalidRequestError as exc:
        logger.warning("Stripe session retrieve invalid request for %s: %s", normalized_session_id, exc)
        if db_order:
            logger.warning("Using DB fallback for checkout session %s after Stripe invalid request", normalized_session_id)
            return serialize_checkout_record(db_order)
        detail = getattr(exc, "user_message", None) or "Session Stripe introuvable"
        raise HTTPException(status_code=404, detail=detail)
    except stripe.error.StripeError as exc:
        logger.exception("Stripe session retrieve failed for %s", normalized_session_id)
        if db_order:
            logger.warning("Using DB fallback for checkout session %s after Stripe error", normalized_session_id)
            return serialize_checkout_record(db_order)
        detail = getattr(exc, "user_message", None) or "Erreur Stripe lors de la recuperation de la session"
        raise HTTPException(status_code=502, detail=detail)
    except Exception:
        logger.exception("Unexpected checkout session retrieval failure for %s", normalized_session_id)
        if db_order:
            logger.warning("Using DB fallback for checkout session %s after unexpected error", normalized_session_id)
            return serialize_checkout_record(db_order)
        raise HTTPException(status_code=500, detail="Erreur interne lors de la recuperation de la session")

    metadata = read_obj_value(session, "metadata", {}) or {}
    order_status = metadata.get("order_status") or (db_order or {}).get("status") or "checkout_created"
    prodigi_order_id = metadata.get("prodigi_order_id") or (db_order or {}).get("prodigi_order_id")
    order_error = metadata.get("order_error") or (db_order or {}).get("prodigi_error")

    cached_order = ORDER_STATUS_CACHE.get(normalized_session_id)
    if cached_order:
        order_status = cached_order.get("order_status") or order_status
        prodigi_order_id = cached_order.get("prodigi_order_id") or prodigi_order_id
        order_error = cached_order.get("order_error") or order_error

    if db_order:
        order_status = db_order.get("status", order_status)
        prodigi_order_id = db_order.get("prodigi_order_id", prodigi_order_id)
        order_error = db_order.get("prodigi_error", order_error)

    return {
        "status": read_obj_value(session, "payment_status") or (db_order or {}).get("payment_status") or "unpaid",
        "customer_email": get_checkout_customer_email(session, fallback=(db_order or {}).get("customer_email")),
        "amount_total": read_obj_value(session, "amount_total") or (db_order or {}).get("amount_total") or (db_order or {}).get("amount"),
        "currency": read_obj_value(session, "currency") or (db_order or {}).get("currency"),
        "order_status": order_status,
        "prodigi_order_id": prodigi_order_id,
        "order_error": order_error,
    }


@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Webhook Stripe : dÃ©clenchÃ© aprÃ¨s paiement rÃ©ussi.
    CrÃ©e automatiquement la commande Prodigi.
    Cet endpoint est sur app (pas api) pour Ã©viter le prefix /api.
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

        # Extraire les donnÃ©es
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
            await upsert_checkout_record(
                session["id"],
                order_status="prodigi_failed",
                payment_status=session.get("payment_status") or "paid",
                customer_email=get_checkout_customer_email(session),
                amount_total=session.get("amount_total"),
                currency=session.get("currency"),
                items=items_data,
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
            await upsert_checkout_record(
                session["id"],
                order_status="prodigi_failed",
                payment_status=session.get("payment_status") or "paid",
                customer_email=get_checkout_customer_email(session),
                amount_total=session.get("amount_total"),
                currency=session.get("currency"),
                items=items_data,
                order_error="Prodigi non configure",
            )
            return JSONResponse(status_code=200, content={"received": True})

        # CrÃ©er la commande Prodigi
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
                    await upsert_checkout_record(
                        session["id"],
                        order_status="prodigi_failed",
                        payment_status=session.get("payment_status") or "paid",
                        customer_email=get_checkout_customer_email(session),
                        amount_total=session.get("amount_total"),
                        currency=session.get("currency"),
                        items=items_data,
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
                    "email": get_checkout_customer_email(session),
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
                await upsert_checkout_record(
                    session["id"],
                    order_status="submitted_to_prodigi",
                    payment_status=session.get("payment_status") or "paid",
                    customer_email=get_checkout_customer_email(session),
                    amount_total=session.get("amount_total"),
                    currency=session.get("currency"),
                    items=items_data,
                    prodigi_order_id=prodigi_order.get("id"),
                )
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
                await upsert_checkout_record(
                    session["id"],
                    order_status="prodigi_failed",
                    payment_status=session.get("payment_status") or "paid",
                    customer_email=get_checkout_customer_email(session),
                    amount_total=session.get("amount_total"),
                    currency=session.get("currency"),
                    items=items_data,
                    order_error=resp.text,
                )

    return JSONResponse(status_code=200, content={"received": True})


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  HEALTH
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

@api.get("/health")
async def health():
    return {
        "status": "ok",
        "prodigi_env": PRODIGI_ENV,
        "db_connected": db is not None,
        "stripe_configured": stripe is not None,
    }


# â”€â”€â”€ Mount & CORS â”€â”€â”€
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

