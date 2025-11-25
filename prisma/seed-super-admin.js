import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

  const existing = await prisma.users.findFirst({
    where: { role: "super_admin" },
  });
  if (existing) {
    console.log(
      "Super admin already exists:",
      existing.email || existing.user_id
    );
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: { name, email, password: hash, role: "super_admin" },
  });
  console.log("Super admin created:", user.user_id, email);
  console.log("IMPORTANT: Change the password if using default.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
