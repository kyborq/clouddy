# from video_caption import generate_video_caption

# # Открываем видеофайл
# with open("test/cat.mp4", "rb") as file:
#     video_bytes = file.read()

# # Генерируем описание видео
# caption = generate_video_caption(video_bytes)

# # Выводим сгенерированное описание
# print(caption)

from PIL import Image

from image_caption import generate_image_caption

image = Image.open("test/kot.png")
caption = generate_image_caption(image)

print(caption)