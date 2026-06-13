import type { RequestHandler } from "express";
import prisma from "../prisma.js";
import { UserStatus } from "../types/enums/UserStatus.js";

export const getUsers: RequestHandler = async (req, res) => {
    const usersDb = await prisma.user.findMany({
        orderBy: {
            lastLogin: "desc"
        },
        omit: {
            password: true
        },
    })
    const users = [];

    for(const user of usersDb) {
        const userStatus = user.isBlocked ? UserStatus.Blocked : user.isVerified ? UserStatus.Active : UserStatus.Unverified;
        const {isBlocked, isVerified, ...rest} = user
        users.push({...rest, status: userStatus});
    }

    const user = users.find(u => u.id === req.user.id);

    res.status(200).json({users, user});
}

export const blockUsers: RequestHandler = async (req, res) => {
    const {userIds, block} = req.body;

    const result = await prisma.user.updateMany({
        where: {
            id: {
                in: userIds,
            }
        },
        data: {
            isBlocked: block,
        }
    });

    res.status(200).json({
        message: `Users ${block ? "blocked" : "unblocked" } successfully`, 
        count: result.count
    });
}

export const deleteUsers: RequestHandler = async (req, res) => {
    const {userIds} = req.body;

    const result = await prisma.user.deleteMany({
        where: {
            id: {
                in: userIds,
            }
        },
    });

    res.status(200).json({
        message: `Users deleted successfully`, 
        count: result.count
    });
}

export const deleteUnverifiedUsers: RequestHandler = async (req, res) => {
    const {userIds} = req.body;
    const result = await prisma.user.deleteMany({
        where: {
            isVerified: false,
            id: {
                in: userIds,
            }
        },
    });

    res.status(200).json({
        message: `Users deleted successfully`, 
        count: result.count
    });
}

