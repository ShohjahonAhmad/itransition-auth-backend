import prisma from "./prisma.js";
// await prisma.user.deleteMany();
await prisma.user.update({
    data: {
        isBlocked: false,
    },
    where: {
        email: "ahmshohjahon@gmail.com"
    }
});
// await prisma.user.createMany({
//      data: [
//         {
//             name: "Admin",
//             email: "admin@example.com",
//             isVerified: true,
//             isBlocked: false,
//             password: "helloworld",
//         },
//         {
//             name: "Admin",
//             email: "admin123@example.com",
//             isVerified: false,
//             isBlocked: false,
//             password: "helloworld",
//         },
//         {
//             name: "student",
//             email: "student@example.com",
//             isVerified: true,
//             isBlocked: true,
//             password: "helloworld",
//         },
//      ]
// });
//# sourceMappingURL=node.js.map