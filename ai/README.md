# AI Services

## Server

1. Install all requirements in ``requirements.txt``

2. Run app with command ``uvicorn app:app --reload``

3. For image caption ``localhost:8000/image-caption``

```bash
curl --location 'http://127.0.0.1:8000/image-caption' \
--form 'file=@"cat.jpg"'
```

4. For video caption ``localhost:8000/video-caption``

```bash
curl --location 'http://127.0.0.1:8000/video-caption' \
--form 'file=@"never-gonna-give-you-up.mp4"'
```

## Models

Used ``transformers`` from HuggingFace and some sort of pre-learned models.

### Image Caption

1. [Salesforce/blip-image-captioning-large](https://huggingface.co/Salesforce/blip-image-captioning-large)

### Video Caption

1. [MCG-NJU/videomae-base](https://huggingface.co/MCG-NJU/videomae-base)

2. GPT-2

3. [Neleac/SpaceTimeGPT](https://huggingface.co/Neleac/SpaceTimeGPT)
