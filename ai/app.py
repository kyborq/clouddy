from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import PlainTextResponse
from PIL import Image
import io
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from bson.objectid import ObjectId

from image_caption import generate_image_caption
from video_caption import generate_video_caption

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
        {"_id": request.record_id},
        {"$set": {"description": caption}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")

    return PlainTextResponse(caption)

if __name__ == "__main__":
  import uvicorn
  uvicorn.run(app, host="0.0.0.0", port=8000)

# to run: uvicorn app:app --reload
