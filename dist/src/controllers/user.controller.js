import prisma from "../prisma.js";
import { UserStatus } from "../types/enums/UserStatus.js";
export const getUsers = async (req, res) => {
    const [usersDb, user] = await Promise.all([
        prisma.user.findMany({
            orderBy: {
                lastLogin: "desc"
            },
            omit: {
                password: true
            },
        }),
        {
            where: { id: req.user.id },
            omit: { password: true }
        }
    ]);
    const users = [];
    for (const user of usersDb) {
        const userStatus = user.isBlocked ? UserStatus.Blocked : user.isVerified ? UserStatus.Active : UserStatus.Unverified;
        const { isBlocked, isVerified, ...rest } = user;
        users.push({ ...rest, status: userStatus });
    }
    res.status(200).json({ users, user });
};
export const blockUsers = async (req, res) => {
    const { userIds, block } = req.body;
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
        message: `Users ${block ? "blocked" : "unblocked"} successfully`,
        count: result.count
    });
};
export const deleteUsers = async (req, res) => {
    const { userIds } = req.body;
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
};
export const deleteUnverifiedUsers = async (req, res) => {
    const { userIds } = req.body;
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
};
//# sourceMappingURL=user.controller.js.map