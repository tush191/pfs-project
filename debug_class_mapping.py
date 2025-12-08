# debug_class_mapping.py
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

TRAIN_DIR = "data/processed/train"  # adjust if your path differs

gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
    TRAIN_DIR,
    target_size=(224,224),
    batch_size=8,
    class_mode="categorical",
    shuffle=False
)

print("train generator class_indices:", gen.class_indices)
# Build ordered list
ci = gen.class_indices
ordered = [None] * len(ci)
for k,v in ci.items():
    ordered[v] = k
print("Ordered class names by index:", ordered)
