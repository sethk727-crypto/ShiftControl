import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Administrator";
const username = (process.env.ADMIN_USERNAME || "").trim().toLowerCase() || null;

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
  process.exit(1);
}
if (password.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);
await prisma.user.upsert({
  where: { email },
  update: { role: "ADMIN", username },
  create: { name, email, username, passwordHash, role: "ADMIN", serviceDetails: "{}" },
});
console.log(`Admin account ready: ${email}`);
await prisma.$disconnect();
