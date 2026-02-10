from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from models.photo import Photo, PhotoCreate, PhotoUpdate

router = APIRouter(prefix="/api/photos", tags=["photos"])

def get_db():
    """Get database instance from app state"""
    from server import db
    return db

@router.get("")
async def get_photos(
    collection: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    \"\"\"Récupère les photos avec pagination optionnelle\"\"\"
    db = get_db()
    query = {}
    if collection:
        query["collectionId"] = collection
    
    total = await db.photos.count_documents(query)
    photos = await db.photos.find(query).sort("order", 1).skip(skip).limit(limit).to_list(limit)
    
    return {
        "photos": [{**photo, "_id": str(photo["_id"])} for photo in photos],
        "total": total,
        "hasMore": (skip + limit) < total
    }

@router.get("/{photo_id}")
async def get_photo(photo_id: str):
    \"\"\"Récupère une photo spécifique\"\"\"
    db = get_db()
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {**photo, "_id": str(photo["_id"])}

@router.post("", response_model=Photo, status_code=status.HTTP_201_CREATED)
async def create_photo(photo: PhotoCreate):
    \"\"\"Ajoute une nouvelle photo\"\"\"
    db = get_db()
    # Vérifier que la collection existe
    collection = await db.collections.find_one({"slug": photo.collectionId})
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    photo_dict = Photo(**photo.dict()).dict()
    result = await db.photos.insert_one(photo_dict)
    
    # Mettre à jour le compteur de photos de la collection
    await db.collections.update_one(
        {"slug": photo.collectionId},
        {"$inc": {"photoCount": 1}}
    )
    
    created = await db.photos.find_one({"_id": result.inserted_id})
    return Photo(**{**created, "_id": str(created["_id"])})

@router.put("/{photo_id}", response_model=Photo)
async def update_photo(photo_id: str, photo_update: PhotoUpdate):
    \"\"\"Met à jour une photo (légendes, localisations, etc.)\"\"\"
    db = get_db()
    update_data = {k: v for k, v in photo_update.dict(exclude_unset=True).items()}
    
    result = await db.photos.update_one(
        {"id": photo_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    updated = await db.photos.find_one({"id": photo_id})
    return Photo(**{**updated, "_id": str(updated["_id"])})

@router.delete("/{photo_id}")
async def delete_photo(photo_id: str):
    \"\"\"Supprime une photo\"\"\"
    db = get_db()
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Décrémenter le compteur de la collection
    await db.collections.update_one(
        {"slug": photo["collectionId"]},
        {"$inc": {"photoCount": -1}}
    )
    
    await db.photos.delete_one({"id": photo_id})
    return {"success": True, "message": "Photo deleted"}
