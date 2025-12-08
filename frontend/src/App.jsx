import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    age: "",
    gender: "male",
    height_cm: "",
    weight_kg: "",
    activity: "low",
    goal: "maintain",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("image", image);
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    try {
      // ✅ FIXED: USE RAILWAY BACKEND URL
      const res = await fetch(
        "https://pfs-project-production.up.railway.app/upload-image",
        {
          method: "POST",
          body: data,
        }
      );

      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
      alert("Server error! Check backend deployment.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h1>AI Fitness Dashboard</h1>

      <label>Age</label>
      <input type="number" name="age" onChange={handleChange} />

      <label>Gender</label>
      <select name="gender" onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <label>Height (cm)</label>
      <input type="number" name="height_cm" onChange={handleChange} />

      <label>Weight (kg)</label>
      <input type="number" name="weight_kg" onChange={handleChange} />

      <label>Activity</label>
      <select name="activity" onChange={handleChange}>
        <option value="sedentary">Sedentary</option>
        <option value="light">Light</option>
        <option value="moderate">Moderate</option>
        <option value="active">Active</option>
      </select>

      <label>Goal</label>
      <select name="goal" onChange={handleChange}>
        <option value="maintain">Maintain</option>
        <option value="lose">Lose Weight</option>
        <option value="gain">Gain Weight</option>
      </select>

      <label>Upload Image</label>
      <input type="file" onChange={handleImage} />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Generate AI Plan"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Results</h2>
          <p><strong>Body Type:</strong> {result.label}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Calories:</strong> {result.calories}</p>

          <h3>Fitness Plan</h3>
          <pre>{JSON.stringify(result.fitness_plan, null, 2)}</pre>

          <h3>Nutrition Plan</h3>
          <pre>{JSON.stringify(result.nutrition_plan, null, 2)}</pre>

          <h3>Workout Plan</h3>
          <pre>{JSON.stringify(result.workout_plan, null, 2)}</pre>

          <h3>Recipes</h3>
          <pre>{JSON.stringify(result.recipes, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
