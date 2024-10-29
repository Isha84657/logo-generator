from flask import Blueprint, request, jsonify
from app.services.image_service import ImageService
import base64
from io import BytesIO
# from pathlib import Path

# DIR_NAME="./tmp_images/"
# dirpath = Path(DIR_NAME)
# create parent dir if doesn't exist
# dirpath.mkdir(parents=True, exist_ok=True)

image_bp = Blueprint('image_routes', __name__)

@image_bp.route('/generate', methods=['POST'])
def generate_image():
    data = request.get_json()
    PROMPT = data.get('prompt')
    NUM_IMAGES = data.get('num_images')
    NEGATIVE_PROMPT = data.get('negative_prompt')

    print(f"Prompt : {PROMPT}")

    output = ImageService.generate_and_save_image(
        PROMPT=PROMPT,
        NUM_IMAGES=NUM_IMAGES if NUM_IMAGES is not None else 2,
        NEGATIVE_PROMPT=NEGATIVE_PROMPT if NEGATIVE_PROMPT is not None else "bad quality"
    )

    images_base64 = []
    for idx, image in enumerate(output.images):
        buffered = BytesIO()
        image.save(buffered, format="PNG")  # or the format you need
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        print(img_str)
        images_base64.append(img_str)

    
    return jsonify({"images": images_base64}), 200

@image_bp.route('/test', methods=['GET'])
def test():
    return jsonify({"return": "Hi, I think the endpoint is working"}), 200
