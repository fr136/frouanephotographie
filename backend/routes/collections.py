from fastapi import APIRouter, HTTPException, status
from typing import List
from models.collection import Collection, CollectionCreate, CollectionUpdate
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/api/collections", tags=["collections"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.get("", response_model=List[Collection])
async def get_collections():
    """Récupère toutes les collections"""
    collections = await db.collections.find().sort("order", 1).to_list(100)
    return [Collection(**{**col, "_id": str(col["_id"])}) for col in collections]

@router.get("/{slug}")
async def get_collection_by_slug(slug: str):
    """Récupère une collection par son slug avec ses photos"""
    collection = await db.collections.find_one({"slug": slug})
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Récupérer les photos de cette collection
    photos = await db.photos.find({"collectionId": slug}).sort("order", 1).to_list(100)
    
    return {
        "collection": Collection(**{**collection, "_id": str(collection["_id"])}),
        "photos": [{**photo, "_id": str(photo["_id"])} for photo in photos]
    }

@router.post("", response_model=Collection, status_code=status.HTTP_201_CREATED)
async def create_collection(collection: CollectionCreate):
    """Crée une nouvelle collection"""
    collection_dict = Collection(**collection.dict()).dict()
    result = await db.collections.insert_one(collection_dict)
    created = await db.collections.find_one({"_id": result.inserted_id})
    return Collection(**{**created, "_id": str(created["_id"])})

@router.put("/{collection_id}", response_model=Collection)
async def update_collection(collection_id: str, collection_update: CollectionUpdate):
    """Met à jour une collection"""
    update_data = {k: v for k, v in collection_update.dict(exclude_unset=True).items()}
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await db.collections.update_one(
        {"id": collection_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    updated = await db.collections.find_one({"id": collection_id})
    return Collection(**{**updated, "_id": str(updated["_id"])})

@router.delete("/{collection_id}")
async def delete_collection(collection_id: str):
    """Supprime une collection"""
    result = await db.collections.delete_one({"id": collection_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Collection not found")
    return {"success": True, "message": "Collection deleted"}
