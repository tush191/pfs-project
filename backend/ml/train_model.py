import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import scipy


# Paths for processed data
BASE_DIR = os.path.dirname(__file__)   # backend/ml
TRAIN_DIR = os.path.join(BASE_DIR, "../../data/processed/train")
VAL_DIR = os.path.join(BASE_DIR, "../../data/processed/val")
MODEL_SAVE_PATH = os.path.join(BASE_DIR, "../../models/bodytype_best.h5")

# Your dataset classes
class_names = ["ectomorph", "mesomorph", "endomorph"]
num_classes = 3


# Image config
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 15

print("Loading training and validation data...")

# Data Augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1./255)

# Load datasets
train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

print("Building MobileNetV2 model...")

# Build Model
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

# Freeze feature extractor
base_model.trainable = False

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(num_classes, activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

print("Training model for", EPOCHS, "epochs...")

# Train the model
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS
)

# Save trained model
model.save(MODEL_SAVE_PATH)
print("Model saved to:", MODEL_SAVE_PATH)
