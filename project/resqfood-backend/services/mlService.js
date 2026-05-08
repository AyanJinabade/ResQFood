export async function checkFoodQuality({ foodName, imagePath }) {
  try {
    // Simulate ML processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Simple deterministic logic (can be extended)
    const lowerName = (foodName || "").toLowerCase();

    let freshness = "fresh";
    let confidence = 0.9;
    let safe_to_donate = true;

    if (
      lowerName.includes("spoiled") ||
      lowerName.includes("rotten") ||
      lowerName.includes("expired")
    ) {
      freshness = "avoid";
      confidence = 0.95;
      safe_to_donate = false;
    }

    return {
      freshness,
      confidence,
      safe_to_donate,
      model: "mock-ml-v1",
      analyzed_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Mock ML error:", error);
    throw new Error("Food quality analysis failed");
  }
}