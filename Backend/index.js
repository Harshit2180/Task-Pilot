import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./database/db.js";
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser";

dotenv.config({ quiet: true });

connectDB()

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
})