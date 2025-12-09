const API_URL = import.meta.env.VITE_API_URL;

export async function uploadImage(formData) {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function getRecipe(bodyType) {
  const res = await fetch(`${API_URL}/recipe?body_type=${bodyType}`);
  return res.json();
}
