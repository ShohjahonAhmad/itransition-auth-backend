import express from "express";
import dotenv from "dotenv";
import prisma from "./prisma.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import authenticated from "./middleware/authenticated.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (_req, res) => {
    res.send("Backend is running");
});
app.get("/userss", async (_req, res) => {
    const user = await prisma.user.findMany();
    res.json(user);
});
app.use("/auth", authRoute);
app.use(authenticated);
app.use("/users", userRoute);
app.get("/me", (req, res) => {
    res.json(req.user);
});
app.use((err, _req, res, _next) => {
    res.status(400).json({ error: err.message });
});
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map