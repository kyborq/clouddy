import io
import av
import numpy as np
import torch
from transformers import AutoImageProcessor, AutoTokenizer, VisionEncoderDecoderModel

def generate_video_caption(video_bytes):
    image_processor = AutoImageProcessor.from_pretrained("MCG-NJU/videomae-base")
    gpt2_tokenizer = AutoTokenizer.from_pretrained("gpt2")
    video_model = VisionEncoderDecoderModel.from_pretrained("Neleac/timesformer-gpt2-video-captioning")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    container = av.open(io.BytesIO(video_bytes))
    seg_len = container.streams.video[0].frames
    clip_len = video_model.config.encoder.num_frames
    indices = set(np.linspace(0, seg_len, num=clip_len, endpoint=False).astype(np.int64))
    frames = []
    container.seek(0)
    for i, frame in enumerate(container.decode(video=0)):
        if i in indices:
            frames.append(frame.to_ndarray(format="rgb24"))
    
    gen_kwargs = {"min_length": 10, "max_length": 20, "num_beams": 8}
    pixel_values = image_processor(frames, return_tensors="pt").pixel_values.to(device)
    tokens = video_model.generate(pixel_values, **gen_kwargs)
    caption = gpt2_tokenizer.batch_decode(tokens, skip_special_tokens=True)[0]
    
    return caption
