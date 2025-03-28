import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken, requireRole } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Fetch a single entry
    const entry = await prisma.journalEntry.findUnique({
      where: { id: id as string },
    });
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    return res.status(200).json(entry);
  }

  if (req.method === "PUT") {
    // Authenticate user
    const decoded = verifyToken(req);
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const entry = await prisma.journalEntry.findUnique({
      where: { id: id as string },
    });
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    // Only admin or owner can update
    if (decoded.role !== "ADMIN" && entry.userId !== decoded.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title, content, category } = req.body;

    const updatedEntry = await prisma.journalEntry.update({
      where: { id: id as string },
      data: { title, content, category },
    });

    return res.status(200).json(updatedEntry);
  }

  if (req.method === "DELETE") {
    try {
      await requireRole(req, "ADMIN");

      await prisma.journalEntry.delete({
        where: { id: id as string },
      });

      return res.status(200).json({ message: "Entry deleted successfully" });
    } catch (error) {
      return res.status(403).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
