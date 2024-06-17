from transformers import BlipProcessor, BlipForConditionalGeneration

def generate_image_caption(image):
    blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
    blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

    text = "a photography of"
    inputs = blip_processor(image, text, return_tensors="pt")
    out = blip_model.generate(**inputs)
    caption = blip_processor.decode(out[0], skip_special_tokens=True)

    return caption

def generate_detailed_image_caption(image):
    blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
    blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

    # Улучшенный текст-запрос для детализированного описания
    text = "a detailed photography of"
    inputs = blip_processor(image, text, return_tensors="pt")

    out = blip_model.generate(**inputs, num_beams=5, num_return_sequences=3)
    captions = [blip_processor.decode(output, skip_special_tokens=True) for output in out]

    # Объединение нескольких сгенерированных описаний
    detailed_caption = " ".join(captions)

    return detailed_caption
