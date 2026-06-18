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
app.get("/api", async (req, res) => {
    const forwarded = req.headers["x-forwarded-for"];
    let ip = forwarded
        ? forwarded.split(",")[0]
        : req.socket.remoteAddress;
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    res.json(data);
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
app.get("/portfolio", async (req, res) => {
    const userId = req.user.id;
    const holdings = await prisma.holding.findMany({
        where: { userId },
    });
    res.json({ holdings });
});
app.post("/portfolio", async (req, res) => {
    const userId = req.user.id;
    const { symbol, shares } = req.body;
    if (!symbol || !shares) {
        res.status(400).json({ error: "Symbol and quantity are required" });
        return;
    }
    const existingHolding = await prisma.holding.findFirst({
        where: {
            userId,
            symbol,
        }
    });
    if (existingHolding) {
        const updated = await prisma.holding.update({
            where: {
                id: existingHolding.id,
            },
            data: {
                shares: existingHolding.shares + shares,
            }
        });
        return res.json({ holding: updated });
    }
    const holding = await prisma.holding.create({
        data: {
            userId,
            symbol,
            shares,
        }
    });
    res.json({ holding });
});
app.use((err, _req, res, _next) => {
    res.status(400).json({ error: err.message });
});
app.delete("/portfolio/:id", async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const holding = await prisma.holding.findFirst({
        where: {
            id,
            userId,
        }
    });
    if (!holding) {
        return res.status(404).json({
            error: "Holding not found"
        });
    }
    await prisma.holding.delete({
        where: { id }
    });
    res.sendStatus(204);
});
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map