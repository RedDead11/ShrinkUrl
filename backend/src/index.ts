import express from "express";
import cors from "cors";
import urlRoutes from "./routes/routes";

const app = express();

app.use(cors()); // allow frontend requests
app.use(express.json());
app.use("/", urlRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
