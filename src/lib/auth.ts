import { NextApiRequest } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

const SECRET_KEY = process.env.JWT_SECRET!;

export function verifyToken(
  token?: string,
): { userId: string; role: string } | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & {
      userId: string;
      role: string;
    };
    console.log("Decoded Token:", decoded); // Log the decoded payload
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function requireRole(req: NextApiRequest, role: "ADMIN" | "USER") {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || user.role !== role) {
    throw new Error("Forbidden");
  }

  return user;
}
