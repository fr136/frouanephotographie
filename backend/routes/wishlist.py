from fastapi import APIRouter, HTTPException, status
from models.wishlist import Wishlist, WishlistItem, NewsletterSubscriber, NewsletterSubscribe
import random
import string
from datetime import datetime

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])

def get_db():
    from server import db
    return db

def generate_promo_code():
    """Génère un code promo unique"""
    return 'FIRST10-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@router.get("/{session_id}")
async def get_wishlist(session_id: str):
    """Récupère la wishlist d'une session"""
    db = get_db()
    wishlist = await db.wishlists.find_one({"sessionId": session_id})
    
    if not wishlist:
        new_wishlist = Wishlist(sessionId=session_id).dict()
        await db.wishlists.insert_one(new_wishlist)
        return new_wishlist
    
    wishlist['_id'] = str(wishlist['_id'])
    return wishlist

@router.post("/{session_id}/items/{photo_id}")
async def add_to_wishlist(session_id: str, photo_id: str):
    """Ajoute une photo à la wishlist"""
    db = get_db()
    
    # Récupérer la photo
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Récupérer ou créer la wishlist
    wishlist = await db.wishlists.find_one({"sessionId": session_id})
    if not wishlist:
        wishlist = Wishlist(sessionId=session_id).dict()
        await db.wishlists.insert_one(wishlist)
    
    # Vérifier si déjà dans la wishlist
    existing = any(item['photoId'] == photo_id for item in wishlist.get('items', []))
    
    if not existing:
        new_item = WishlistItem(
            photoId=photo['id'],
            photoTitle=photo['title'],
            photoImage=photo['imageUrl']
        ).dict()
        
        await db.wishlists.update_one(
            {"sessionId": session_id},
            {"$push": {"items": new_item}, "$set": {"updatedAt": datetime.utcnow()}}
        )
    
    updated = await db.wishlists.find_one({"sessionId": session_id})
    updated['_id'] = str(updated['_id'])
    return updated

@router.delete("/{session_id}/items/{photo_id}")
async def remove_from_wishlist(session_id: str, photo_id: str):
    """Retire une photo de la wishlist"""
    db = get_db()
    
    result = await db.wishlists.update_one(
        {"sessionId": session_id},
        {"$pull": {"items": {"photoId": photo_id}}, "$set": {"updatedAt": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"success": True}

# Newsletter Routes
newsletter_router = APIRouter(prefix="/api/newsletter", tags=["newsletter"])

@newsletter_router.post("/subscribe")
async def subscribe_newsletter(data: NewsletterSubscribe):
    """Inscription à la newsletter avec génération code promo 10%"""
    db = get_db()
    
    # Vérifier si email déjà inscrit
    existing = await db.newsletter_subscribers.find_one({"email": data.email})
    if existing:
        return {"success": True, "message": "Déjà inscrit", "promoCode": existing['promoCode']}
    
    # Générer code promo unique
    promo_code = generate_promo_code()
    
    # Enregistrer le subscriber
    subscriber = NewsletterSubscriber(
        email=data.email,
        promoCode=promo_code
    ).dict()
    
    await db.newsletter_subscribers.insert_one(subscriber)
    
    # Créer le code promo dans la table promo_codes
    promo_data = {
        "code": promo_code,
        "discount": 10.0,
        "active": True,
        "usageLimit": 1,
        "usageCount": 0,
        "createdAt": datetime.utcnow()
    }
    await db.promo_codes.insert_one(promo_data)
    
    return {
        "success": True,
        "message": "Merci ! Voici votre code promo",
        "promoCode": promo_code,
        "discount": 10
    }

@newsletter_router.get("/stats")
async def get_newsletter_stats():
    """Statistiques newsletter (admin)"""
    db = get_db()
    
    total = await db.newsletter_subscribers.count_documents({})
    used = await db.newsletter_subscribers.count_documents({"used": True})
    
    return {
        "total": total,
        "used": used,
        "unused": total - used,
        "conversionRate": (used / total * 100) if total > 0 else 0
    }
