import express from "express";
import cors from "cors";
import foodRoutes from "./routes/foodRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", foodRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ ResQFood backend running on port ${PORT}`);
});
