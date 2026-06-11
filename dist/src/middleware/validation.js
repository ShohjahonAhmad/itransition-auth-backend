import z from 'zod';
import * as schemas from "./schemas.js";
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        next(new Error(result.error.issues.map(e => e.message).join(", ")));
        return;
    }
    next();
};
export const RegisterUser = validateBody(schemas.RegisterSchema);
export const LoginUser = validateBody(schemas.LoginSchema);
export const BlockUsers = validateBody(schemas.BlockUsersSchema);
export const DeleteUsers = validateBody(schemas.DeleteUsersSchema);
//# sourceMappingURL=validation.js.map