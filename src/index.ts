import express from "express";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/accounts", accountRoutes);

app.get("/", (req, res) => {
  res.send("Bank API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
