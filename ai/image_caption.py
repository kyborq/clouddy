from transformers import BlipProcessor, BlipForConditionalGeneration

def generate_image_caption(image):
    blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
    blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

    text = "a photography of"
    inputs = blip_processor(image, text, return_tensors="pt")
    out = blip_model.generate(**inputs)
    caption = blip_processor.decode(out[0], skip_special_tokens=True)

    return caption