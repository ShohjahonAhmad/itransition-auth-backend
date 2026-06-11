import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import "dotenv/config";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const transport = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    }
});
const BASE_URL = process.env.BASE_URL || "http://localhost:8081";
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes from now
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                tokens: {
                    create: {
                        token,
                        tokenExpiry,
                    }
                }
            },
            omit: {
                password: true,
            }
        });
        sendEmailToken(email, token).catch(console.error);
        res.status(201).json({ user });
    }
    catch (error) {
        if (error.code === "P2002") {
            res.status(409).json({ error: `A user with this email already exists` });
            return;
        }
        res.status(500).json({ error: "An error occurred while registering the user" });
    }
};
async function sendEmailToken(email, token) {
    const verifyUrl = `${BASE_URL}/auth/verify/${token}`;
    const mailOptions = {
        from: `ITRANSITION AUTH <${EMAIL_USER}>`,
        to: email,
        subject: "Please verify your email",
        text: `Click the following link to verify your email: ${verifyUrl}`,
    };
    const info = await transport.sendMail(mailOptions);
    console.log(info.response);
}
export const verifyEmail = async (req, res) => {
    const token = req.params.token;
    if (!token) {
        res.status(400).json({ error: "Token is required" });
        return;
    }
    const tokenRecord = await prisma.emailVerification.findUnique({
        where: { token },
    });
    if (!tokenRecord || tokenRecord.tokenExpiry < new Date()) {
        res.status(400).json({ error: "Invalid token" });
        return;
    }
    await prisma.$transaction([
        prisma.user.update({
            data: {
                isVerified: true,
            },
            where: {
                id: tokenRecord.userId,
            }
        }),
        prisma.emailVerification.delete({
            where: {
                token,
            }
        })
    ]);
    res.send("Email verified successfully");
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    if (user.isBlocked) {
        res.status(403).json({ error: "Your account is blocked. Please contact support." });
        return;
    }
    await prisma.user.update({
        data: {
            lastLogin: new Date(),
        },
        where: {
            id: user.id
        }
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "24h"
    });
    res.status(200).json({ token });
};
//# sourceMappingURL=auth.controller.js.map