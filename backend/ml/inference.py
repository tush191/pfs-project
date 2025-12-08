import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../models/bodytype_best.h5')

# Your 5-class women body shape dataset
CLASS_NAMES = ["apple", "hourglass", "inverted_triangle", "pear", "rectangle"]

def load_img(path):
    img = Image.open(path).convert("RGB").resize((224, 224))
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

_model = None

def predict(path, class_names=CLASS_NAMES):
    global _model
    if _model is None:
        print("Loading model from:", MODEL_PATH)
        _model = load_model(MODEL_PATH)

    img = load_img(path)
    pred = _model.predict(img)[0]
    idx = int(np.argmax(pred))
    confidence = float(pred[idx])

    return class_names[idx], confidence
