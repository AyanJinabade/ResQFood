import { checkFoodQuality } from "../services/mlService.js";

export async function analyzeFood(req, res) {
  try {
    const result = await checkFoodQuality({
      imageFile: req.file,
      foodType: req.body.foodType,
      hoursSinceCooked: req.body.hoursSinceCooked,
      storage: req.body.storage,
    });

    // 🔴 HARD REJECTION LOGIC
    if (result.decision !== "fresh") {
      return res.status(400).json({
        success: false,
        rejected: true,
        reason: result.decision, // "spoiled" | "unclear"
        confidence: result.confidence,
        message:
          result.decision === "spoiled"
            ? "Food appears spoiled and cannot be donated."
            : "Food quality is unclear. Please upload a clearer image.",
      });
    }

    // ✅ ONLY fresh food reaches here
    return res.json({
      success: true,
      decision: result.decision,
      confidence: result.confidence,
    });

  } catch (err) {
    console.error("Analyze food error:", err);
    res.status(500).json({ success: false, message: "Food analysis failed" });
  }
}
