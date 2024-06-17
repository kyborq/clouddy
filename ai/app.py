# app.py
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import PlainTextResponse
from PIL import Image
import io
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from bson.objectid import ObjectId

from image_caption import generate_image_caption
from video_caption import generate_video_caption
from image_search import find_best_match, get_top_matches

MONGO_DETAILS = "mongodb://localhost:27017"
DATABASE_NAME = "reshare"
COLLECTION_NAME = "storages"

app = FastAPI()

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client[DATABASE_NAME]
collection = database[COLLECTION_NAME]

class CaptionRequest(BaseModel):
    record_id: str

@app.post("/image-caption/{request}")
async def image_caption(request: str, file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    caption = generate_image_caption(image)

    result = await collection.update_one(
        {"_id": ObjectId(request)},
        {"$set": {"description": caption}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")

    return PlainTextResponse(caption)

@app.post("/video-caption")
async def video_caption(request: CaptionRequest, file: UploadFile = File(...)):
    contents = await file.read()
    caption = generate_video_caption(contents)

    # Update the MongoDB document with the given record_id
    result = await collection.update_one(
        {"_id": ObjectId(request.record_id)},
        {"$set": {"description": caption}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")

    return PlainTextResponse(caption)

@app.get("/best-match")
async def get_best_match(query: str):
    try:
        best_match, similarity = await find_best_match(query)
        if best_match is None or similarity < 0.35:
            return {
            "description": "А, ой... Ничего не нашлось",
            "similarity": similarity * 100 if similarity is not None else 0
        }
        return {
            "description": best_match.get('description', ''),
            "path": best_match.get('fileName', ''),
            "similarity": similarity * 100 if similarity is not None else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/top-matches")
async def get_top_matches(query: str):
    try:
        top_matches = await get_top_matches(query)
        if not top_matches:
             return {
            "description": "А, ой... Ничего не нашлось",
        }
        results = []
        for match, similarity in top_matches:
            results.append({
                "description": match.get('description', ''),
                "path": match.get('fileName', ''),
                "similarity": similarity * 100 if similarity is not None else 0
            })
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
