import jwt, { JwtPayload } from "jsonwebtoken";

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
