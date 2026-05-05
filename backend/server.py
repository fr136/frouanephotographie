"""
Backend Franck Rouane Photographie
- Proxy sÃ©curisÃ© vers Prodigi API v4 (quotes, orders, status)
- Stripe Checkout (paiement avant commande Prodigi)
- Formulaire de contact (stockage + email optionnel)
- Newsletter (stockage)
"""

from fastapi import FastAPI, APIRouter, HTTPException, Request, Header
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
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# â"€â"€â"€ Config â"€â"€â"€
MONGO_URL = os.environ.get('MONGO_URL', '')
DB_NAME = os.environ.get('DB_NAME', 'frouane_photo')
PRODIGI_API_KEY = os.environ.get('PRODIGI_API_KEY', '')
PRODIGI_ENV = os.environ.get('PRODIGI_ENV', 'sandbox')
PRODIGI_ASSET_BASE_URL = os.environ.get('PRODIGI_ASSET_BASE_URL', '')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
BLOB_READ_WRITE_TOKEN = os.environ.get('BLOB_READ_WRITE_TOKEN', '')
ADMIN_DEBUG_ENABLED = os.environ.get('ADMIN_DEBUG_ENABLED', '').lower() in {'1', 'true', 'yes'}
ADMIN_API_KEY = os.environ.get('ADMIN_API_KEY', '')
ALLOW_MANUAL_REVIEW_PRODUCTS = os.environ.get('ALLOW_MANUAL_REVIEW_PRODUCTS', '').lower() in {'1', 'true', 'yes'}
PRINT_ASSET_CATALOG_PATH = ROOT_DIR.parent / 'server' / 'catalog' / 'printAssetCatalog.private.json'
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
    logging.warning("stripe package not installed - payment disabled")

# â"€â"€â"€ MongoDB â"€â"€â"€
client = None
db = None

# â"€â"€â"€ App â"€â"€â"€
app = FastAPI(title="Franck Rouane Photographie API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# â"€â"€â"€ Startup / Shutdown â"€â"€â"€
@app.on_event("startup")
async def startup():
    global client, db
    if MONGO_URL:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        logger.info("MongoDB connected")
    else:
        logger.warning("MONGO_URL not set - DB features disabled")


@app.on_event("shutdown")
async def shutdown():
    if client:
        client.close()


#â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  PRODIGI - SKU Mapping
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

POSTER_SKUS_BY_RATIO = {
    '2:3': {
        '12x18': 'GLOBAL-FAP-12X18',
        '16x24': 'GLOBAL-FAP-16X24',
        '20x30': 'GLOBAL-FAP-20X30',
        '24x36': 'GLOBAL-FAP-24X36',
        '30x45': 'GLOBAL-FAP-30X45',
    },
    '3:4': {
        '12x16': 'GLOBAL-FAP-12X16',
        '18x24': 'GLOBAL-FAP-18X24',
        '24x32': 'GLOBAL-FAP-24X32',
        '30x40': 'GLOBAL-FAP-30X40',
    },
    '1:1': {
        '12x12': 'GLOBAL-FAP-12X12',
        '16x16': 'GLOBAL-FAP-16X16',
        '20x20': 'GLOBAL-FAP-20X20',
        '24x24': 'GLOBAL-FAP-24X24',
        '30x30': 'GLOBAL-FAP-30X30',
    },
    '4:5': {
        '8x10': 'GLOBAL-FAP-8X10',
        '16x20': 'GLOBAL-FAP-16X20',
        '20x24': 'GLOBAL-FAP-20X24',
    },
    'panoramic': {
        '10x20': 'GLOBAL-FAP-10X20',
        '12x24': 'GLOBAL-FAP-12X24',
        '20x40': 'GLOBAL-FAP-20X40',
    },
}

FRAME_SKUS_BY_RATIO = {
    '2:3': {
        '12x18': 'GLOBAL-CFP-12X18',
        '20x30': 'GLOBAL-CFP-20X30',
        '24x36': 'GLOBAL-CFP-24X36',
    },
    '3:4': {
        '12x16': 'GLOBAL-CFP-12X16',
        '18x24': 'GLOBAL-CFP-18X24',
        '24x32': 'GLOBAL-CFP-24X32',
        '30x40': 'GLOBAL-CFP-30X40',
    },
    '1:1': {
        '12x12': 'GLOBAL-CFP-12X12',
        '16x16': 'GLOBAL-CFP-16X16',
        '20x20': 'GLOBAL-CFP-20X20',
        '24x24': 'GLOBAL-CFP-24X24',
        '30x30': 'GLOBAL-CFP-30X30',
    },
    '4:5': {
        '8x10': 'GLOBAL-CFP-8X10',
        '16x20': 'GLOBAL-CFP-16X20',
        '20x24': 'GLOBAL-CFP-20X24',
    },
    'panoramic': {
        '10x20': 'GLOBAL-CFP-10X20',
        '12x24': 'GLOBAL-CFP-12X24',
        '20x40': 'GLOBAL-CFP-20X40',
    },
}

PRODIGI_SKUS = {
    **{size: sku for sizes in POSTER_SKUS_BY_RATIO.values() for size, sku in sizes.items()},
    **{f"frame:{size}": sku for sizes in FRAME_SKUS_BY_RATIO.values() for size, sku in sizes.items()},
}

FORMATS_BY_GRADE = {
    'A': [],
    'B': [],
    'C': [],
}

SUPPORTS_BY_GRADE = {
    'A': ['poster', 'frame'],
    'B': ['poster', 'frame'],
    'C': ['poster', 'frame'],
}

SUPPORT_LABELS = {
    "poster": "Affiche Fine Art",
    "canvas": "Toile imprimée",
    "frame": "Tableau encadré",
}

PRINT_PRICES = {
    'poster': {
        '8x10': 25,
        '10x20': 39,
        '12x12': 29,
        '12x16': 35,
        '12x18': 39,
        '12x24': 49,
        '16x16': 39,
        '16x20': 45,
        '16x24': 49,
        '18x24': 55,
        '20x20': 55,
        '20x24': 59,
        '20x30': 65,
        '20x40': 89,
        '24x24': 69,
        '24x32': 79,
        '24x36': 89,
        '30x30': 89,
        '30x40': 99,
        '30x45': 109,
    },
    'frame': {
        '8x10': 69,
        '10x20': 95,
        '12x12': 79,
        '12x16': 89,
        '12x18': 95,
        '12x24': 119,
        '16x16': 99,
        '16x20': 99,
        '18x24': 129,
        '20x20': 119,
        '20x24': 139,
        '20x30': 149,
        '20x40': 199,
        '24x24': 159,
        '24x32': 179,
        '24x36': 199,
        '30x30': 199,
        '30x40': 229,
    },
    'canvas': {},
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


def normalize_catalog_entries(raw_catalog) -> dict:
    if isinstance(raw_catalog, dict):
        return raw_catalog

    if isinstance(raw_catalog, list):
        return {
            item.get('id'): item
            for item in raw_catalog
            if isinstance(item, dict) and item.get('id')
        }

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


def get_catalog_product(product_id: str) -> dict:
    product = PRODUCT_CATALOG.get(product_id)
    if not product:
        # Sécurité : bloque toute tentative de produit invalide (fraude ou bug client)
        logger.warning("ALERT product_id inconnu dans le catalogue: %r", product_id)
        raise HTTPException(status_code=400, detail="Produit invalide")
    return product


def get_product_preview_url(product: dict) -> str:
    return build_public_asset_url(product.get('asset_path') or '')


def getAllowedFormatsForGrade(grade: str) -> List[str]:
    return FORMATS_BY_GRADE.get(grade, [])


def getAllowedSupportsForGrade(grade: str) -> List[str]:
    return SUPPORTS_BY_GRADE.get(grade, [])


def validateProductConfiguration(product: dict) -> dict:
    match_status = product.get('ratioMatchStatus')
    if match_status not in {'perfect', 'crop-safe', 'manual-review', 'incompatible'}:
        raise HTTPException(status_code=500, detail="Statut ratio invalide")

    if match_status == 'incompatible':
        return product

    allowed_supports = product.get('allowedSupports') or []
    if not isinstance(allowed_supports, list) or not allowed_supports:
        raise HTTPException(status_code=500, detail="Aucun support d'impression compatible")

    allowed_sizes = product.get('allowedPrintSizes') or {}
    if not isinstance(allowed_sizes, dict) or not allowed_sizes:
        raise HTTPException(status_code=500, detail="Aucune taille d'impression compatible")

    sku_grid = product.get('prodigiSkuBySupportAndSize') or {}
    if not isinstance(sku_grid, dict):
        raise HTTPException(status_code=500, detail="Catalogue SKU Prodigi invalide")

    for support in allowed_supports:
        support_skus = sku_grid.get(support)
        if support_skus is None or not isinstance(support_skus, dict):
            raise HTTPException(status_code=500, detail=f"SKU manquants pour support {support}")
        support_sizes = allowed_sizes.get(support)
        if not isinstance(support_sizes, list) or not support_sizes:
            raise HTTPException(status_code=500, detail=f"Tailles manquantes pour support {support}")
        for entry in support_sizes:
            size = entry.get('size') if isinstance(entry, dict) else None
            if not size or not support_skus.get(size):
                raise HTTPException(status_code=500, detail=f"SKU manquant pour {support} {size}")

    return product


def get_private_catalog_product(product_id: str) -> dict:
    asset = normalize_catalog_entries(load_print_asset_catalog()).get(product_id)
    if not asset:
        raise HTTPException(status_code=500, detail=f"Catalogue Blob manquant pour {product_id}")
    return validateProductConfiguration(asset)


def getPrintAsset(productId: str, size: str, support: Optional[str] = None) -> dict:
    get_catalog_product(productId)
    asset = get_private_catalog_product(productId)
    selected_support = support or 'poster'
    match_status = asset.get('ratioMatchStatus')

    if match_status == 'incompatible':
        raise HTTPException(status_code=400, detail=f"Ratio incompatible pour {productId}")
    if match_status == 'manual-review' and not ALLOW_MANUAL_REVIEW_PRODUCTS:
        raise HTTPException(status_code=403, detail=f"Produit en revue manuelle: {productId}")

    allowed_supports = asset.get('allowedSupports') or []
    if selected_support not in allowed_supports:
        raise HTTPException(
            status_code=400,
            detail=f"Support indisponible pour {productId}: {selected_support}",
        )

    allowed_print_sizes_by_support = asset.get('allowedPrintSizes') or {}
    allowed_print_sizes = allowed_print_sizes_by_support.get(selected_support) or []
    allowed_size_ids = [entry.get('size') for entry in allowed_print_sizes if isinstance(entry, dict)]
    if size not in allowed_size_ids:
        raise HTTPException(
            status_code=400,
            detail=f"Taille indisponible pour {productId}: {size}",
        )

    sku_grid = asset.get('prodigiSkuBySupportAndSize') or {}
    support_skus = sku_grid.get(selected_support) or {}

    blob_path = (asset.get('blobPath') or '').strip()
    if not blob_path:
        raise HTTPException(status_code=500, detail=f"blobPath manquant pour {productId}")

    selected_size = next((entry for entry in allowed_print_sizes if entry.get('size') == size), {})

    return {
        "productId": productId,
        "size": size,
        "displaySize": selected_size.get('displaySize') or size,
        "support": selected_support,
        "grade": asset.get('grade'),
        "aspectRatio": asset.get('aspectRatio'),
        "ratioGroup": asset.get('ratioGroup'),
        "ratioMatchStatus": match_status,
        "cropWarning": bool(asset.get('cropWarning')),
        "blobPath": blob_path,
        "prodigiSku": support_skus.get(size),
    }


def get_product_print_asset(product_id: str, size: str, support: str) -> dict:
    return getPrintAsset(product_id, size, support)


def get_checkout_unit_amount(product_id: str, size: str, support: str) -> int:
    print_asset = get_product_print_asset(product_id, size, support)
    get_prodigi_sku(product_id, size, support, print_asset)
    try:
        return PRINT_PRICES[support][size] * 100
    except KeyError as exc:
        raise HTTPException(status_code=400, detail="Configuration prix invalide") from exc


def get_prodigi_sku(product_id: str, size: str, support: str, print_asset: Optional[dict] = None) -> str:
    asset = print_asset or getPrintAsset(product_id, size, support)
    sku = asset.get("prodigiSku")
    if not sku:
        raise HTTPException(status_code=503, detail=f"SKU Prodigi manquant pour {product_id} {support} {size}")
    return sku


def build_prodigi_asset_url(blob_path: str) -> Optional[str]:
    if not PRODIGI_ASSET_BASE_URL:
        return None
    return f"{PRODIGI_ASSET_BASE_URL.rstrip('/')}/{blob_path.lstrip('/')}"


async def createProdigiOrder(order: dict) -> dict:
    items = []
    for item in order.get("items", []):
        product_id = item["productId"]
        size = item.get("size") or item.get("format")
        support = item["support"]
        print_asset = getPrintAsset(product_id, size, support)
        sku = get_prodigi_sku(product_id, size, support, print_asset)
        items.append({
            "sku": sku,
            "copies": item.get("quantity", 1),
            "sizing": "fillPrintArea",
            "assets": [
                {
                    "printArea": "default",
                    # TODO: provide a short-lived server URL for Prodigi without
                    # exposing the private Vercel Blob URL or token.
                    "url": None,
                }
            ],
            "metadata": {
                "productId": product_id,
                "size": size,
                "support": support,
                "grade": print_asset["grade"],
                "aspectRatio": print_asset["aspectRatio"],
                "ratioGroup": print_asset["ratioGroup"],
                "ratioMatchStatus": print_asset["ratioMatchStatus"],
                "cropWarning": str(print_asset["cropWarning"]).lower(),
            },
        })

    order_payload = {
        "shippingMethod": order.get("shippingMethod", "Standard"),
        "merchantReference": order.get("merchantReference") or f"frouane-{uuid.uuid4().hex[:8]}",
        "recipient": order.get("recipient", {}),
        "items": items,
    }

    return {
        "status": "prepared",
        "submitted": False,
        "order_payload": order_payload,
        "reason": "Prodigi order prepared only; secure private asset delivery is TODO",
    }


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
#  PRODIGI - Quote
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
#  PRODIGI - Create Order
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
    product_id: str
    size: str
    support: str
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
    """Preparer ou creer une commande de tirage via Prodigi."""
    prodigi_order = await createProdigiOrder({
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
        "items": [
            {
                "productId": item.product_id,
                "size": item.size,
                "support": item.support,
                "quantity": item.copies,
            }
            for item in req.items
        ],
    })
    order = prodigi_order.get("order", {})

    # Sauvegarder en DB si disponible
    if db:
        await db.orders.insert_one({
            "prodigi_order_id": order.get("id"),
            "merchant_reference": order.get("merchantReference"),
            "recipient_name": req.recipient.name,
            "recipient_email": req.recipient.email,
            "status": "submitted_to_prodigi" if prodigi_order.get("submitted") else "prodigi_prepared",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "items": [
                {"product_id": i.product_id, "size": i.size, "support": i.support, "copies": i.copies}
                for i in req.items
            ]
        })

    return OrderResponse(
        order_id=order.get("id", ""),
        status=order.get("status", {}).get("stage") if prodigi_order.get("submitted") else "Prepared",
        merchant_reference=order.get("merchantReference") or prodigi_order.get("order_payload", {}).get("merchantReference")
    )


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  PRODIGI - Order Status
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
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=30)
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


@api.post("/contact")
@limiter.limit("5/minute")
async def submit_contact(request: Request, msg: ContactMessage):
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
        logger.info(f"Contact message saved: id={doc['id']}")
    else:
        logger.info(f"Contact message (no DB): id={doc['id']}, subject={msg.subject!r}")

    return {"success": True, "message": "Message reçu"}


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  NEWSLETTER
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class NewsletterSubscription(BaseModel):
    email: EmailStr


@api.post("/newsletter/subscribe")
@limiter.limit("3/minute")
async def subscribe_newsletter(request: Request, sub: NewsletterSubscription):
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
    product_id: str = Field(..., min_length=1, max_length=100)
    support: str = Field(..., min_length=1, max_length=50)
    size: str = Field(..., min_length=1, max_length=20)
    title: Optional[str] = Field(None, max_length=200)
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

    line_items = []
    metadata_items = []
    for item in req.items:
        product_id = item.product_id
        product = get_catalog_product(product_id)

        print_asset = get_product_print_asset(product_id, item.size, item.support)
        unit_amount = get_checkout_unit_amount(product_id, item.size, item.support)
        preview_url = get_product_preview_url(product)
        support_label = SUPPORT_LABELS.get(item.support, item.support)

        line_items.append({
            "price_data": {
                "currency": "eur",
                "unit_amount": unit_amount,
                "product_data": {
                    "name": f"{support_label} - {product['title']} - {print_asset['displaySize']}",
                    "description": "Tirage Fine Art, édition limitée",
                    **({"images": [preview_url]} if preview_url else {}),
                },
            },
            "quantity": item.quantity,
        })
        metadata_items.append({
            "productId": product_id,
            "title": product['title'],
            "size": item.size,
            "displaySize": print_asset["displaySize"],
            "support": item.support,
            "grade": print_asset["grade"],
            "aspectRatio": print_asset["aspectRatio"],
            "ratioGroup": print_asset["ratioGroup"],
            "ratioMatchStatus": print_asset["ratioMatchStatus"],
            "cropWarning": str(print_asset["cropWarning"]).lower(),
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
        raise HTTPException(status_code=500, detail="Erreur lors de la création du paiement. Veuillez réessayer.")


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

        # CrÃ©er la commande Prodigi
        if items_data:
            try:
                prodigi_result = await createProdigiOrder({
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
                    "items": [
                        {
                            "productId": item.get("productId"),
                            "size": item.get("size") or item.get("format"),
                            "support": item.get("support"),
                            "quantity": item.get("quantity", 1),
                        }
                        for item in items_data
                    ],
                })
            except HTTPException as exc:
                update_checkout_status_cache(
                    session["id"],
                    order_status="prodigi_failed",
                    order_error=str(exc.detail),
                )
                update_stripe_session_metadata(
                    session["id"],
                    session.get("metadata", {}),
                    order_status="prodigi_failed",
                    order_error=str(exc.detail),
                )
                await upsert_checkout_record(
                    session["id"],
                    order_status="prodigi_failed",
                    payment_status=session.get("payment_status") or "paid",
                    customer_email=get_checkout_customer_email(session),
                    amount_total=session.get("amount_total"),
                    currency=session.get("currency"),
                    items=items_data,
                    order_error=str(exc.detail),
                )
                return JSONResponse(status_code=200, content={"received": True})

            if prodigi_result.get("submitted"):
                prodigi_order = prodigi_result.get("order", {})
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
                pending_reason = prodigi_result.get("reason", "Commande Prodigi preparee")
                logger.warning("Prodigi order prepared but not submitted: %s", pending_reason)
                update_checkout_status_cache(
                    session["id"],
                    order_status="prodigi_prepared",
                    order_error=pending_reason,
                )
                update_stripe_session_metadata(
                    session["id"],
                    session.get("metadata", {}),
                    order_status="prodigi_prepared",
                    order_error=pending_reason,
                )
                await upsert_checkout_record(
                    session["id"],
                    order_status="prodigi_prepared",
                    payment_status=session.get("payment_status") or "paid",
                    customer_email=get_checkout_customer_email(session),
                    amount_total=session.get("amount_total"),
                    currency=session.get("currency"),
                    items=items_data,
                    order_error=pending_reason,
                )

    return JSONResponse(status_code=200, content={"received": True})


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  HEALTH
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

@api.get("/admin/blob-health")
async def blob_health(x_admin_key: Optional[str] = Header(None)):
    if not ADMIN_API_KEY or x_admin_key != ADMIN_API_KEY:
        raise HTTPException(status_code=404, detail="Not found")

    if not ADMIN_DEBUG_ENABLED:
        raise HTTPException(status_code=403, detail="Admin debug disabled")

    if not BLOB_READ_WRITE_TOKEN:
        raise HTTPException(status_code=503, detail="Vercel Blob non configure")

    try:
        from vercel.blob import list_objects
    except ImportError as exc:
        raise HTTPException(status_code=503, detail="SDK Vercel Blob manquant") from exc

    try:
        page = list_objects(limit=100, prefix="prints/", token=BLOB_READ_WRITE_TOKEN)
    except Exception as exc:
        logger.exception("Vercel Blob health check failed")
        raise HTTPException(status_code=502, detail="Erreur Vercel Blob") from exc

    return {
        "status": "ok",
        "has_more": page.has_more,
        "cursor": page.cursor,
        "blobs": [
            {
                "pathname": blob.pathname,
                "size": blob.size,
                "uploaded_at": blob.uploaded_at.isoformat() if blob.uploaded_at else None,
                "etag": blob.etag,
            }
            for blob in page.blobs
        ],
    }


@api.get("/health")
async def health():
    return {
        "status": "ok",
        "db_connected": db is not None,
        "stripe_configured": stripe is not None,
    }


# â"€â"€â"€ Mount & CORS â"€â"€â"€
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "stripe-signature", "X-Admin-Key"],
)

