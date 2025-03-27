import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma"; // Prisma Client instance

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
