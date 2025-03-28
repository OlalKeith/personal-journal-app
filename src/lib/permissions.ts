import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "./auth";

export async function requireRole(req: NextRequest, role: "ADMIN" | "USER") {
  const decoded = verifyToken(req);
  if (!decoded || typeof decoded === "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

  if (!user || user.role !== role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}
