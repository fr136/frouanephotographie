"""Script pour initialiser la base de données avec les collections et photos"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# Données des 6 collections avec ~10 photos chacune
COLLECTIONS_DATA = [
    {
        "id": "calanques-marseille",
        "title": "Calanques de Marseille",
        "subtitle": "Les joyaux cachés de la côte",
        "description": "Explorez la beauté sauvage des calanques, ces fjords méditerranéens où la roche blanche plonge dans les eaux turquoise.",
        "category": "calanques",
        "coverImage": "https://images.unsplash.com/photo-1672861864274-6b24d19b578d",
        "slug": "calanques-marseille",
        "photoCount": 10,
        "order": 1
    },
    {
        "id": "ports-cote-azur",
        "title": "Ports de la Côte d'Azur",
        "subtitle": "L'élégance maritime",
        "description": "Des petits ports de pêche authentiques aux marinas prestigieuses, découvrez le charme intemporel de nos havres maritimes.",
        "category": "ports",
        "coverImage": "https://images.unsplash.com/photo-1712227609859-2818504d07cb",
        "slug": "ports-cote-azur",
        "photoCount": 10,
        "order": 2
    },
    {
        "id": "couchers-soleil",
        "title": "Couchers de Soleil",
        "subtitle": "L'or de la Méditerranée",
        "description": "Ces moments magiques où le ciel s'embrase et la mer se pare de mille reflets dorés.",
        "category": "sunset",
        "coverImage": "https://images.unsplash.com/photo-1712103554238-aca4fda947df",
        "slug": "couchers-soleil",
        "photoCount": 10,
        "order": 3
    },
    {
        "id": "cote-sauvage",
        "title": "Côte Sauvage",
        "subtitle": "La puissance des éléments",
        "description": "Les falaises abruptes, les vagues qui se brisent, la nature dans toute sa force et sa majesté.",
        "category": "wild",
        "coverImage": "https://images.unsplash.com/photo-1547399614-28c8a1734469",
        "slug": "cote-sauvage",
        "photoCount": 10,
        "order": 4
    },
    {
        "id": "criques-secretes",
        "title": "Criques Secrètes",
        "subtitle": "Les trésors cachés",
        "description": "Des havres de paix préservés, accessibles seulement aux plus aventureux, où la nature règne en maître.",
        "category": "coves",
        "coverImage": "https://images.unsplash.com/photo-1604948559069-3287d5c5a6e5",
        "slug": "criques-secretes",
        "photoCount": 10,
        "order": 5
    },
    {
        "id": "paysages-maritimes",
        "title": "Paysages Maritimes",
        "subtitle": "L'horizon infini",
        "description": "La contemplation pure de la mer, ses horizons sans fin, ses couleurs changeantes au fil des heures.",
        "category": "seascapes",
        "coverImage": "https://images.unsplash.com/photo-1627041193914-66f1cf8fbf4f",
        "slug": "paysages-maritimes",
        "photoCount": 10,
        "order": 6
    }
]

# Images temporaires pour chaque collection (10 photos variées)
TEMP_IMAGES = [
    "https://images.unsplash.com/photo-1672861864274-6b24d19b578d",
    "https://images.unsplash.com/photo-1712227609859-2818504d07cb",
    "https://images.unsplash.com/photo-1712103554238-aca4fda947df",
    "https://images.unsplash.com/photo-1691325011849-de814c92dbbd",
    "https://images.unsplash.com/photo-1758769523560-d060d8326fd8",
    "https://images.unsplash.com/photo-1759325107581-cf3277629733",
    "https://images.unsplash.com/photo-1604948559069-3287d5c5a6e5",
    "https://images.unsplash.com/photo-1547399614-28c8a1734469",
    "https://images.unsplash.com/photo-1627041193914-66f1cf8fbf4f",
    "https://images.pexels.com/photos/34712669/pexels-photo-34712669.jpeg"
]

async def seed_database():
    """Initialise la base de données avec les collections et photos"""
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🌱 Initialisation de la base de données...")
    
    # Vider les collections existantes
    await db.collections.delete_many({})
    await db.photos.delete_many({})
    print("✓ Collections existantes supprimées")
    
    # Insérer les collections
    for collection_data in COLLECTIONS_DATA:
        collection_data["createdAt"] = datetime.utcnow()
        collection_data["updatedAt"] = datetime.utcnow()
        await db.collections.insert_one(collection_data)
    print(f"✓ {len(COLLECTIONS_DATA)} collections créées")
    
    # Générer 10 photos pour chaque collection
    total_photos = 0
    for collection in COLLECTIONS_DATA:
        for i in range(10):
            photo_data = {
                "id": f"{collection['slug']}-photo-{i+1:02d}",
                "title": f"{collection['title']} - Photo {i+1}",
                "collectionId": collection['slug'],
                "imageUrl": TEMP_IMAGES[i % len(TEMP_IMAGES)],
                "caption": None,  # À remplir plus tard
                "location": None,  # À remplir plus tard
                "dateTaken": None,
                "camera": None,
                "settings": None,
                "tags": [collection['category']],
                "order": i + 1,
                "featured": i == 0,  # Première photo en featured
                "createdAt": datetime.utcnow()
            }
            await db.photos.insert_one(photo_data)
            total_photos += 1
    
    print(f"✓ {total_photos} photos créées (10 par collection)")
    print("\n✅ Base de données initialisée avec succès!")
    print("\nNote: Les champs 'caption' et 'location' sont vides et peuvent être remplis via l'API.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
