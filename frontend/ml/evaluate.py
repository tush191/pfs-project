import os
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
from sklearn.metrics import confusion_matrix, classification_report

MODEL_PATH = "../../models/bodytype_best.h5"
TEST_DIR = "../../data/processed/test"
OUTPUT_DIR = "../../outputs"

os.makedirs(OUTPUT_DIR, exist_ok=True)

model = load_model(MODEL_PATH)

test_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
    TEST_DIR,
    target_size=(224,224),
    batch_size=16,
    class_mode="categorical",
    shuffle=False
)

preds = model.predict(test_gen)
y_pred = np.argmax(preds, axis=1)
y_true = test_gen.classes
labels = list(test_gen.class_indices.keys())

# CONFUSION MATRIX
cm = confusion_matrix(y_true, y_pred)

plt.imshow(cm)
plt.title("Confusion Matrix")
plt.colorbar()
plt.xticks(range(len(labels)), labels)
plt.yticks(range(len(labels)), labels)
plt.xlabel("Predicted")
plt.ylabel("Actual")

for i in range(len(labels)):
    for j in range(len(labels)):
        plt.text(j, i, cm[i, j], ha="center")

plt.savefig(os.path.join(OUTPUT_DIR, "confusion_matrix.png"))
plt.close()

# CLASSIFICATION REPORT
print("\n✅ CLASSIFICATION REPORT\n")
print(classification_report(y_true, y_pred, target_names=labels))
