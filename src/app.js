import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// form data configuration
app.use(
  express.json({
    limit: "16kb",
  })
);

// URL data configuration
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// static files(images, pdf's, favicon, ...), folders configuration
app.use(express.static("public"));

// cookie parser configuration
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

export { app };
