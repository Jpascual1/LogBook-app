import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  ...(clientOrigin ? [clientOrigin] : []),
  ...(!isProduction
    ? ["http://localhost:5173", "http://127.0.0.1:5173"]
    : []),
];

app.use(
  cors({
    origin:
      allowedOrigins.length > 0
        ? allowedOrigins
        : !isProduction
          ? true
          : false,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  })
);
app.use(express.json());

const clerkMw = clerkMiddleware();
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  return clerkMw(req, res, next);
});

app.use("/records", records);

app.use((err, req, res, _next) => {
  console.error(err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({
    error: err instanceof Error ? err.message : "Internal Server Error",
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
