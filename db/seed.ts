import "dotenv/config";
import { prisma } from "./prisma";
import SampleData from "./sample-data";

async function main() {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    await prisma.product.createMany({
        data: SampleData.products,
    });
    await prisma.user.createMany({
        data: SampleData.users,
    });
    console.log("Database seeded successfully");
   // await prisma.$disconnect();
}

main();