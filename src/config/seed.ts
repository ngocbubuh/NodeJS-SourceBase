import { Gender, PrismaClient, UserRole } from '@prisma/client';
import { PasswordUtil } from '../utils/password/password.util';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { email: 'master@master.com' },
        update: { password: await PasswordUtil.hashPassword('Abc@12345') }, //Reset Master Password in case of forgot
        create: {
            firstName: 'Master',
            lastName: 'Admin',
            phone: '0123456789',
            age: 20,
            role: UserRole.admin,
            emailVerified: true,
            gender: Gender.male,
            email: 'master@master.com',
            password: await PasswordUtil.hashPassword('Abc@12345')
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