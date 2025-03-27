import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  console.log("Authorization Header:", authHeader); // 🔍 Check if the token is received correctly

  const decoded = verifyToken(token);
  console.log("Decoded Token:", decoded); // 🔍 Check if the token is decoded correctly

  if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId as string },
  });

  console.log("User from DB:", user); // 🔍 Check if the user exists in the database

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  const { entryId } = req.body;

  await prisma.journalEntry.delete({
    where: { id: entryId },
  });

  return res.status(200).json({ message: "Entry deleted successfully" });
}
