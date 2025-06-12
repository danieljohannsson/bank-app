import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middleware/authMiddleware";
import { setupSwagger } from "./swagger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use(
  "/api/v1/accounts",
  (req, res, next) => {
    authenticateToken(req, res, next);
  },
  accountRoutes
);

app.get("/", (req, res) => {
  res.send("Bank API is running");
});

setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
