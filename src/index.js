

import express from "express";
import userRoutes from "./routes/userRoutes.js"
import mongoose from "mongoose";
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

const app = express();
const PORT = 3000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"]
}
))

app.use(express.json())
app.use(cookieParser())

// app.get("/", (req,res) => {
//     res.send("Hello World!, This is the homepage");
// });

await connectDB(process.env.MONGODB_URI_1)

app.use(express.json())
app.use("/api", userRoutes)

const start = async () => {
    const uri = "mongodb+srv://klassic_dd:Jerrykid1.@cluster0.mpqpalr.mongodb.net/dev"
    if (!uri || uri.includes("<db_password>")) {
        console.error("MONGODB_URI is missing or still contains <db_password> placeholder. Update .env and retry.")
        process.exit(1)
    }
    try {
        await connectDB(uri)
        console.log("MongoDB connected")
    } catch (err) {
        console.error("MongoDB connection failed:", err.message)
        process.exit(1)
    }
}

start()

if (process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () =>{
        console.log(`server is running on http://localhost:${PORT}/api`)
    })
}

    app.listen(3000, () => {
        console.log("Server is running on port http://localhost:3000")
    })
