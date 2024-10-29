from flask import Blueprint, request, jsonify
from app.services.image_service import ImageService
import base64

image_bp = Blueprint('image_routes', __name__)

@image_bp.route('/generate', methods=['POST'])
def generate_image():
    data = request.get_json()
    PROMPT = data.get('prompt')
    NUM_IMAGES = data.get('num_images')
    NEGATIVE_PROMPT  = data.get('negative_prompt')

    print(f"Prompt : {PROMPT}")

    images = ImageService.generate_and_save_image(
        PROMPT=PROMPT, 
        NUM_IMAGES= NUM_IMAGES if NUM_IMAGES != None else 2,
        NEGATIVE_PROMPT = NEGATIVE_PROMPT if NEGATIVE_PROMPT != None else "bad quality"
        )

    # Convert each image to a base64-encoded string
    images_base64 = []
    for image in images:
        print(image)
        base64_bytes = base64.b64encode(image)
        base64_string = base64_bytes.decode("utf-8")
        images_base64.append(base64_string)
    
    # Return the images as a JSON-compatible response
    return jsonify({"images": images_base64}), 200

    

    
    return jsonify({"images": images}), 200

@image_bp.route('/test', methods=['GET'])
def test():
    return jsonify({"return": "Hii, I think endpoint working" }), 200