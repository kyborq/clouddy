# image_search.py
from sentence_transformers import SentenceTransformer, util
import numpy as np
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"
DATABASE_NAME = "reshare"
COLLECTION_NAME = "storages"

# Load the SentenceTransformer model
model = SentenceTransformer('sentence-transformers/xlm-r-100langs-bert-base-nli-stsb-mean-tokens')

# Connect to the MongoDB database
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client[DATABASE_NAME]
image_collection = db[COLLECTION_NAME]

# Function to encode the descriptions and store them in the MongoDB database
async def encode_descriptions():
    async for image in image_collection.find():
        if 'description' in image and 'description_embedding' not in image:
            description = image['description']
            description_embedding = model.encode(description, convert_to_numpy=True)
            if description_embedding is not None:
                await image_collection.update_one({'_id': image['_id']}, {'$set': {'description_embedding': description_embedding.tolist()}})

# Function to find the best match for a query
async def find_best_match(query):
    await encode_descriptions()
    query_embedding = model.encode(query, convert_to_numpy=True)
    if query_embedding is None:
        return None, None
    
    query_embedding = query_embedding / np.linalg.norm(query_embedding)

    best_match = None
    highest_similarity = -1

    async for image in image_collection.find():
        if 'description_embedding' in image:
            description_embedding = np.array(image['description_embedding'])
            description_embedding = description_embedding / np.linalg.norm(description_embedding)
            similarity = np.dot(query_embedding, description_embedding)

            if similarity > highest_similarity:
                highest_similarity = similarity
                best_match = image

    if best_match and 'fileName' in best_match:
        return best_match, highest_similarity
    else:
        return None, None

# Function to get the top matches for a query
async def get_top_matches(query, top_k=5):
    await encode_descriptions()
    query_embedding = model.encode(query, convert_to_numpy=True)
    if query_embedding is None:
        return []
    
    query_embedding = query_embedding / np.linalg.norm(query_embedding)

    similarities = []

    async for image in image_collection.find():
        if 'description_embedding' in image:
            description_embedding = np.array(image['description_embedding'])
            description_embedding = description_embedding / np.linalg.norm(description_embedding)
            similarity = np.dot(query_embedding, description_embedding)
            if similarity is not None:
                similarities.append((image, similarity))

    similarities.sort(key=lambda x: x[1], reverse=True)
    top_matches = [(image, similarity) for image, similarity in similarities[:top_k] if 'fileName' in image]

    return top_matches

async def encode_description(description):
    return model.encode(description, convert_to_numpy=True).tolist()