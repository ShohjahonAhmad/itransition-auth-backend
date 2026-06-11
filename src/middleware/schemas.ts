import { use } from "react";
import z, { email } from "zod";

export const UserSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    password: z.string(),

    isVerified: z.boolean(),
    isBlocked: z.boolean(),  

    lastLogin: z.date().nullable(),
    createdAt: z.date(),
});

export const RegisterSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(1),
}).strict();

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
}).strict();

export const BlockUsersSchema = z.object({
    userIds: z.array(z.uuid()).min(1),
    block: z.boolean(),
}).strict();

export const DeleteUsersSchema = z.object({
    userIds: z.array(z.uuid()).min(1),
}).strict();