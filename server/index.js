import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./src/config/db.js";
import authRouter from "./src/routers/auth.route.js";
import userRoute from "./src/routers/user.route.js";
import geminiResponse from "./gemini.js";

dotenv.config();
const PORT = process.env.PORT || 9090
const DB_URL = process.env.DB_URL

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Welcome to ZenVA.</h1>')
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRoute);

app.listen(PORT, () => {
    connectDB(DB_URL);
    console.log(`Server is runing at http://localhost:${PORT}`);
})