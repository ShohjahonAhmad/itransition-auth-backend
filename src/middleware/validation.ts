import z from 'zod';
import * as schemas from "./schemas.js";
import type { RequestHandler } from 'express';

const validateBody = (schema: z.ZodType<any>): RequestHandler => (req, res, next) =>{
    const result = schema.safeParse(req.body);

    if(!result.success) {
        next(new Error(result.error.issues.map(e => e.message).join(", ")));
        return;
    }

    next()
}

export const RegisterUser = validateBody(schemas.RegisterSchema);
export const LoginUser = validateBody(schemas.LoginSchema);
export const BlockUsers = validateBody(schemas.BlockUsersSchema);
export const DeleteUsers = validateBody(schemas.DeleteUsersSchema);