"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const enums_1 = require("../src/utils/enums/enums");
const password_util_1 = require("../src/utils/password/password.util");
const prisma = new client_1.PrismaClient();
async function main() {
    const roles = Object.values(enums_1.UserRole);
    for (const role of roles) {
        await prisma.role.upsert({
            where: { roleName: role },
            update: {},
            create: { roleName: role },
        });
    }
    const user = await prisma.user.upsert({
        where: { email: 'master' },
        update: {},
        create: {
            firstName: 'Master',
            lastName: 'Admin',
            phone: '0123456789',
            age: 20,
            emailVerified: true,
            gender: enums_1.Gender.MALE.toString(),
            email: 'master',
            password: await password_util_1.PasswordUtil.hashPassword('Abc@12345')
        }
    });
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: user.id,
                roleId: (await prisma.role.findFirstOrThrow({
                    where: { roleName: enums_1.UserRole.ADMIN.toString().toLowerCase() }
                }))?.id
            }
        },
        update: {},
        create: {
            user: { connect: { id: user.id } },
            role: { connect: { roleName: enums_1.UserRole.ADMIN.toString().toLowerCase() } }
        }
    });
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map