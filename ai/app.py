from fastapi import FastAPI, File, UploadFile
from fastapi.responses import PlainTextResponse
from PIL import Image
import io

from image_caption import generate_image_caption
from video_caption import generate_video_caption

app = FastAPI()

@app.post("/image-caption")
async def image_caption(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    caption = generate_image_caption(image)
    return PlainTextResponse(caption)

@app.post("/video-caption")
async def video_caption(file: UploadFile = File(...)):
    contents = await file.read()
    caption = generate_video_caption(contents)
    return PlainTextResponse(caption)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
# to run: uvicorn app:app --reload