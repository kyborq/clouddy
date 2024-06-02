import os
from flask import Flask, request, jsonify
from image_caption import generate_image_caption
from video_caption import generate_video_caption
from PIL import Image



app = Flask(__name__)

@app.route('/image-caption', methods=['POST'])
def image_caption():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        image = Image.open(file).convert('RGB')
        caption = generate_image_caption(image)
        return jsonify({'caption': caption})

@app.route('/video-caption', methods=['POST'])
def video_caption():
    try:
        video_buffer = request.data
        if not video_buffer:
            return jsonify({'error': 'No data received'}), 400

        # Save buffer to a temporary file
        video_path = 'video.mp4'
        with open(video_path, 'wb') as f:
            f.write(video_buffer)

        # Generate caption
        caption = generate_video_caption(video_path)

        # Clean up the temporary file
        os.remove(video_path)

        return jsonify({'caption': caption})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,use_debugger=False)