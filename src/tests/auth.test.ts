import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

describe("Authentication", () => {
  it("should hash a password correctly", async () => {
    const password = "mypassword";
    const hashed = await bcrypt.hash(password, 10);
    expect(await bcrypt.compare(password, hashed)).toBe(true);
  });

  it("should generate and verify a JWT token", () => {
    const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // const mockRequest = {
    //   headers: new Headers({
    //     authorization: `Bearer ${token}`,
    //   }),
    // } as unknown as NextRequest;

    const decoded = verifyToken(token);
    expect(decoded).toHaveProperty("userId", "123");
  });
});
