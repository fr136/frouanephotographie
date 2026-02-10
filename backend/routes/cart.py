from fastapi import APIRouter, HTTPException, status
from typing import Optional
from models.cart import Cart, CartItemCreate, CartItem, PromoCode
import random
import string

router = APIRouter(prefix="/api/cart", tags=["cart"])

def get_db():
    from server import db
    return db

# Prix selon les formats
FORMAT_PRICES = {
    "30x40cm": 180,
    "40x60cm": 210,
    "50x70cm": 240,
    "60x90cm": 270,
    "70x100cm": 300,
    "80x120cm": 350,
    "100x150cm": 450
}

def calculate_cart_total(cart: dict) -> dict:
    """Calcule le total du panier avec réduction si applicable"""
    subtotal = sum(item['price'] * item['quantity'] for item in cart.get('items', []))
    discount_amount = 0
    
    if cart.get('promoCode'):
        # Chercher le code promo dans la DB
        # Pour l'instant, hard-coded
        if cart['promoCode'] == 'FIRST10':
            discount_amount = subtotal * 0.1
    
    cart['total'] = subtotal - discount_amount
    cart['discount'] = discount_amount
    return cart

@router.get("/{session_id}")
async def get_cart(session_id: str):
    """Récupère le panier d'une session"""
    db = get_db()
    cart = await db.carts.find_one({"sessionId": session_id})
    
    if not cart:
        # Créer un nouveau panier
        new_cart = Cart(sessionId=session_id).dict()
        await db.carts.insert_one(new_cart)
        return new_cart
    
    cart['_id'] = str(cart['_id'])
    return cart

@router.post("/{session_id}/items")
async def add_to_cart(session_id: str, item: CartItemCreate):
    """Ajoute un article au panier"""
    db = get_db()
    
    # Récupérer la photo
    photo = await db.photos.find_one({"id": item.photoId})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Calculer le prix selon le format
    price = FORMAT_PRICES.get(item.format, 180)
    
    # Récupérer ou créer le panier
    cart = await db.carts.find_one({"sessionId": session_id})
    if not cart:
        cart = Cart(sessionId=session_id).dict()
        await db.carts.insert_one(cart)
    
    # Vérifier si l'article existe déjà
    existing_item = None
    for cart_item in cart.get('items', []):
        if cart_item['photoId'] == item.photoId and cart_item['format'] == item.format:
            existing_item = cart_item
            break
    
    if existing_item:
        # Augmenter la quantité
        await db.carts.update_one(
            {"sessionId": session_id, "items.id": existing_item['id']},
            {"$inc": {"items.$.quantity": item.quantity}}
        )
    else:
        # Ajouter nouvel article
        new_item = CartItem(
            photoId=item.photoId,
            photoTitle=photo['title'],
            photoImage=photo['imageUrl'],
            format=item.format,
            price=price,
            quantity=item.quantity
        ).dict()
        
        await db.carts.update_one(
            {"sessionId": session_id},
            {"$push": {"items": new_item}}
        )
    
    # Récalculer le total
    updated_cart = await db.carts.find_one({"sessionId": session_id})
    updated_cart = calculate_cart_total(updated_cart)
    
    await db.carts.update_one(
        {"sessionId": session_id},
        {"$set": {"total": updated_cart['total'], "discount": updated_cart['discount']}}
    )
    
    return updated_cart

@router.delete("/{session_id}/items/{item_id}")
async def remove_from_cart(session_id: str, item_id: str):
    """Supprime un article du panier"""
    db = get_db()
    
    result = await db.carts.update_one(
        {"sessionId": session_id},
        {"$pull": {"items": {"id": item_id}}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Récalculer le total
    updated_cart = await db.carts.find_one({"sessionId": session_id})
    updated_cart = calculate_cart_total(updated_cart)
    
    await db.carts.update_one(
        {"sessionId": session_id},
        {"$set": {"total": updated_cart['total'], "discount": updated_cart['discount']}}
    )
    
    return {"success": True}

@router.put("/{session_id}/items/{item_id}")
async def update_cart_item(session_id: str, item_id: str, quantity: int):
    """Met à jour la quantité d'un article"""
    db = get_db()
    
    if quantity <= 0:
        return await remove_from_cart(session_id, item_id)
    
    result = await db.carts.update_one(
        {"sessionId": session_id, "items.id": item_id},
        {"$set": {"items.$.quantity": quantity}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Récalculer le total
    updated_cart = await db.carts.find_one({"sessionId": session_id})
    updated_cart = calculate_cart_total(updated_cart)
    
    await db.carts.update_one(
        {"sessionId": session_id},
        {"$set": {"total": updated_cart['total'], "discount": updated_cart['discount']}}
    )
    
    return updated_cart

@router.post("/{session_id}/promo")
async def apply_promo_code(session_id: str, code: str):
    """Applique un code promo"""
    db = get_db()
    
    # Vérifier le code promo
    promo = await db.promo_codes.find_one({"code": code.upper(), "active": True})
    
    if not promo:
        raise HTTPException(status_code=404, detail="Code promo invalide")
    
    # Appliquer le code
    await db.carts.update_one(
        {"sessionId": session_id},
        {"$set": {"promoCode": code.upper()}}
    )
    
    # Récalculer le total
    updated_cart = await db.carts.find_one({"sessionId": session_id})
    
    subtotal = sum(item['price'] * item['quantity'] for item in updated_cart.get('items', []))
    discount_amount = subtotal * (promo['discount'] / 100)
    
    await db.carts.update_one(
        {"sessionId": session_id},
        {"$set": {"total": subtotal - discount_amount, "discount": discount_amount}}
    )
    
    updated_cart = await db.carts.find_one({"sessionId": session_id})
    updated_cart['_id'] = str(updated_cart['_id'])
    
    return updated_cart

@router.delete("/{session_id}")
async def clear_cart(session_id: str):
    """Vide le panier"""
    db = get_db()
    
    await db.carts.update_one(
        {"sessionId": session_id},
        {"$set": {"items": [], "total": 0, "discount": 0, "promoCode": None}}
    )
    
    return {"success": True}
