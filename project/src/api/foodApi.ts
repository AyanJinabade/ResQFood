export async function analyzeFood(formData: FormData) {
  const response = await fetch(
    "http://localhost:4000/api/food/analyze",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  // ✅ Return rejection info instead of throwing
  if (!response.ok) {
    return data;
  }

  return data;
}
