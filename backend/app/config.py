import os

class Config:
    # MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/your_db')
    SDXL_MODEL_PATH = os.getenv('SDXL_MODEL_PATH', '/path/to/finetuned/LoRa/model')
    BASE_MODEL = "stabilityai/stable-diffusion-xl-base-1.0"
    LoRA_WEIGHTS = "artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
    ADAPTOR_NAME = "SDXL Logo LoRA"

