import express from "express";
import cors from "cors";
import route from "./routes/NotesRoute.js";  // sesuaikan nama filenya jika beda
import "./models/index.js";  // import model agar relasi dan sinkronisasi jalan
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Konfigurasi CORS dengan whitelist origin dan opsi credentials
const corsOptions = {
  origin: [
    "http://localhost:3000", // untuk development
    "https://frontend-fahmi-028-dot-a-08-450504.uc.r.appspot.com" // untuk production
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // pre-flight request

app.use(express.json());
app.use(cookieParser());  // supaya bisa baca req.cookies
app.use(route);  // pakai route dari NotesRoute.js

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
