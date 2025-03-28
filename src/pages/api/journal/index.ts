import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    // Fetch all journal entries
    const entries = await prisma.journalEntry.findMany();
    return res.status(200).json(entries);
  }

  if (req.method === "POST") {
    // Verify user authentication
    const decoded = verifyToken(req);
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, content, category } = req.body;

    // Create new journal entry
    const newEntry = await prisma.journalEntry.create({
      data: {
        title,
        content,
        category,
        userId: decoded.userId,
      },
    });

    return res.status(201).json(newEntry);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
