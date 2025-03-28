import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { prisma } from "../lib/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TEST_SECRET = process.env.JWT_SECRET!;

describe("RBAC - Role-Based Access Control", () => {
  let userToken: string;
  let adminToken: string;
  let entryId: string;

  beforeAll(async () => {
    // Create a USER

    try {
      // Create a USER
      const user = await prisma.user.create({
        data: {
          email: "user@example.com",
          password: await bcrypt.hash("password", 10),
          role: "USER",
        },
      });
      userToken = jwt.sign({ userId: user.id }, TEST_SECRET, {
        expiresIn: "1h",
      });
      console.log("User created:", user);
    } catch (error) {
      console.error("Error creating user:", error);
    }

    // Create an ADMIN
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: await bcrypt.hash("password", 10),
        role: "ADMIN",
      },
    });
    console.log("Admin Role from DB:", admin.role);

    adminToken = jwt.sign({ userId: admin.id, role: admin.role }, TEST_SECRET, {
      expiresIn: "1h",
    });

    // Create a Journal Entry
    const entry = await prisma.journalEntry.create({
      data: {
        title: "Test Entry",
        content: "This is a test journal entry.",
        category: "Personal",
        userId: admin.id,
      },
    });
    entryId = entry.id;
  });

  it("should prevent USER from deleting a journal entry", async () => {
    const res = await fetch("http://localhost:3000/api/journal/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entryId }),
    });

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Forbidden: Admins only");
  });

  it("should allow ADMIN to delete a journal entry", async () => {
    console.log("Admin Token:", adminToken);
    const res = await fetch("http://localhost:3000/api/journal/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entryId }),
    });
    console.log("Response Status:", res.status);
    console.log("Response Body:", await res.json());

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe("Entry deleted successfully");
  });

  afterAll(async () => {
    await prisma.journalEntry.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});
