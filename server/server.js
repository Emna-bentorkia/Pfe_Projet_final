import express from "express"; 
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import cvRouter from "./routes/cvRoute.js";

const app = express();
const port = process.env.PORT || 5001;
connectDB();

// Middleware Setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true , }));

// Routes
app.get('/', (req, res) => res.send("API Working!!"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/cv', cvRouter);   // Assurez-vous que cette ligne est correcte

// Route pour 404 (route non trouvée)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Server Listening
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
