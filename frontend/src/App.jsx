import { useState } from "react";
import "./index.css";

export default function App() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("light");
  const [goal, setGoal] = useState("maintain");
  const [image, setImage] = useState(null);

  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
  if (!image) return alert("Upload image!");

  setLoading(true);
  setResult(null);

  const formData = new FormData();
  formData.append("image", image);
  formData.append("age", age);
  formData.append("gender", gender);
  formData.append("height_cm", height);
  formData.append("weight_kg", weight);
  formData.append("activity", activity);
  formData.append("goal", goal);

  try {
    const res = await fetch(
      "https://pfs-project-production.up.railway.app/upload-image",
      {
        method: "POST",
        body: formData,   // ✅ FIXED
      }
    );

    const data = await res.json();
    setResult(data);

  } catch (err) {
    console.error(err);
    alert("Backend Error!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] px-4 py-6 flex justify-center">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 shadow-2xl animate-fadeIn">

        {/* ✅ TITLE */}
        <h1 className="text-cyan-400 text-xl font-bold text-center mb-6">
          AI Fitness Dashboard
        </h1>

        {/* ✅ FORM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input placeholder="Age" className="input" onChange={e => setAge(e.target.value)} />
          <select className="input" onChange={e => setGender(e.target.value)}>
            <option>male</option>
            <option>female</option>
          </select>

          <input placeholder="Height (cm)" className="input" onChange={e => setHeight(e.target.value)} />
          <input placeholder="Weight (kg)" className="input" onChange={e => setWeight(e.target.value)} />

          <select className="input" onChange={e => setActivity(e.target.value)}>
            <option value="light">Low Activity</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
          </select>

          <select className="input" onChange={e => setGoal(e.target.value)}>
            <option value="maintain">Maintain</option>
            <option value="lose">Lose</option>
            <option value="gain">Gain</option>
          </select>
        </div>

        {/* ✅ FILE INPUT */}
        <div className="mt-4">
          <label className="bg-cyan-500 text-black px-4 py-2 rounded-lg text-sm cursor-pointer inline-block">
            Upload Image
            <input type="file" hidden onChange={handleImage} />
          </label>
        </div>

        {/* ✅ BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full mt-5 py-3 rounded-xl bg-cyan-400 text-black font-semibold hover:scale-[1.02] transition animate-pulseGlow"
        >
          {loading ? "Generating AI Plan..." : "Generate AI Plan"}
        </button>

        {/* ✅ IMAGE PREVIEW */}
        {preview && (
          <div className="mt-5 flex justify-center">
            <img src={preview} className="w-40 rounded-xl image-hover shadow-xl" />
          </div>
        )}

        {/* ✅ LOADING SPINNER */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* ✅ RESULTS */}
        {result && (
          <div className="mt-6 animate-fadeIn">
            <div className="bg-slate-800 rounded-xl p-4 mb-3">
              <p className="text-white font-semibold">
                Body Type: <span className="text-cyan-400">{result.label}</span>
              </p>
              <p className="text-gray-300">
                Calories: {Math.round(result.calories)} kcal/day
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 mb-3">
              <h3 className="text-cyan-400 font-bold mb-2">Workout Plan</h3>
              <ul className="text-gray-300 text-sm list-disc pl-4">
                {result.fitness_plan.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="text-cyan-400 font-bold mb-2">Nutrition Plan</h3>
              <ul className="text-gray-300 text-sm list-disc pl-4">
                {result.nutrition_plan.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
