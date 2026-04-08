import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  ...(clientOrigin ? [clientOrigin] : []),
  ...(!isProduction ? ["http://localhost:5173"] : []),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use("/records", records);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;