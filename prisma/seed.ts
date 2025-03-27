import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: hashedPassword,
      role: "ADMIN", // or "USER"
    },
  });

  console.log("User created:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
