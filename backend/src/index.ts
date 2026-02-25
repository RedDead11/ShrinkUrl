import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import urlRoutes from "./routes/routes";

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 10, // 10 reqs per 10 mins per IP
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true, // sends rate limit info in response headers
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());
app.use("/shorten", limiter); // only apply to /shorten, not redirects
app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
