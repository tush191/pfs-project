import sys
import os
sys.path.append(os.path.dirname(__file__))

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

from ml.recommendations import recommendations

app = Flask(__name__)
CORS(app)

# ✅ ✅ CORRECT MODEL PATH (FIXED)
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "bodytype_best.h5")



# ✅ 3 CLASS NAMES (FINAL)
CLASS_NAMES = ["ectomorph", "endomorph", "mesomorph"]


# ✅ LOAD MODEL
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model Loaded Successfully")

# -------------------------------
# ✅ HELPER FUNCTIONS
# -------------------------------
def preprocess_image(img):
    img = img.resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def bmr(age, gender, height_cm, weight_kg):
    if gender.lower() == "male":
        return 10*weight_kg + 6.25*height_cm - 5*age + 5
    return 10*weight_kg + 6.25*height_cm - 5*age - 161

def tdee(age, gender, height_cm, weight_kg, activity):
    mult = {"sedentary":1.2,"light":1.375,"moderate":1.55,"active":1.725}.get(activity,1.2)
    return bmr(age, gender, height_cm, weight_kg) * mult

def calorie_target(tdee_val, goal):
    if goal == "lose": return tdee_val * 0.8
    if goal == "gain": return tdee_val * 1.15
    return tdee_val

def generate_workout(level, goal):
    return [
        {"day":"Mon","ex":["Squats 3x10","Pushups 3x10"]},
        {"day":"Tue","ex":["30min walk"]},
        {"day":"Wed","ex":["Rest"]},
    ]

def find_recipes_by_ingredients(ingredients):
    return [{"title":"Omelette","ingredients":["egg","salt"]}]

# -------------------------------
# ✅ ✅ MAIN ML PREDICTION ROUTE
# -------------------------------
@app.route("/upload-image", methods=["POST"])
def upload_image():

    # ✅ 1. IMAGE INPUT
    image_file = request.files["image"]
    img = Image.open(image_file).convert("RGB")
    img_array = preprocess_image(img)

    # ✅ 2. MODEL PREDICTION
    preds = model.predict(img_array)[0]
    class_index = np.argmax(preds)
    body_type = CLASS_NAMES[class_index]
    confidence = float(preds[class_index])

    print("✅ RAW MODEL OUTPUT:", preds)
    print("✅ PREDICTED BODY TYPE:", body_type)

    # ✅ 3. USER DETAILS
    age = int(request.form.get("age", 25))
    gender = request.form.get("gender", "male")
    height_cm = float(request.form.get("height_cm", 170))
    weight_kg = float(request.form.get("weight_kg", 70))
    activity = request.form.get("activity", "moderate")
    goal = request.form.get("goal", "maintain")

    # ✅ 4. CALORIE CALCULATION
    tdee_val = tdee(age, gender, height_cm, weight_kg, activity)
    calories = calorie_target(tdee_val, goal)

    workout_plan = generate_workout(body_type, goal)
    recipes = find_recipes_by_ingredients(["egg", "chicken", "rice"])

    # ✅ 5. FINAL RESPONSE TO FRONTEND
    result = {
        "label": body_type,
        "confidence": confidence,
        "fitness_plan": recommendations[body_type]["fitness_plan"],
        "nutrition_plan": recommendations[body_type]["nutrition_plan"],
        "calories": calories,
        "workout_plan": workout_plan,
        "recipes": recipes
    }

    return jsonify(result)

# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

