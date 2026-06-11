import z from "zod";
export declare const UserSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    isVerified: z.ZodBoolean;
    isBlocked: z.ZodBoolean;
    lastLogin: z.ZodNullable<z.ZodDate>;
    createdAt: z.ZodDate;
}, z.z.core.$strip>;
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.z.core.$strict>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.z.core.$strict>;
export declare const BlockUsersSchema: z.ZodObject<{
    userIds: z.ZodArray<z.ZodUUID>;
    block: z.ZodBoolean;
}, z.z.core.$strict>;
export declare const DeleteUsersSchema: z.ZodObject<{
    userIds: z.ZodArray<z.ZodUUID>;
}, z.z.core.$strict>;
//# sourceMappingURL=schemas.d.ts.map