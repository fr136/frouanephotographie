import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def init_promo_codes():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🎁 Initialisation du code promo FIRST10...")
    
    # Vérifier si existe déjà
    existing = await db.promo_codes.find_one({"code": "FIRST10"})
    if existing:
        print("✓ Code FIRST10 existe déjà")
    else:
        promo = {
            "code": "FIRST10",
            "discount": 10.0,
            "active": True,
            "usageLimit": None,  # Illimité
            "usageCount": 0,
            "createdAt": datetime.utcnow()
        }
        await db.promo_codes.insert_one(promo)
        print("✓ Code FIRST10 créé : -10% sur toutes les commandes")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_promo_codes())
