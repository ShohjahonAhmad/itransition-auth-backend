import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import prisma from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const authenticated: RequestHandler= async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization!;
        const token = authHeader.split(" ")[1]!;

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            }
        });

        if(!user) {
            res.status(401).json({error: "User no longer exists"});
            return;
        }

        if(user.isBlocked){
            res.status(403).json({error: "User is blocked. Please contact support."});
            return;
        }

        next();
    } catch (_) {
        res.status(401).json({error: "Unauthenticated"});
    }
}

export default authenticated