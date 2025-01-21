import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET|| "secret_key"; // Use environment variables in production
const JWT_EXPIRES_IN = "1h"; // Adjust expiration time as needed

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Ensure the decoded value is of type JwtPayload
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as JwtPayload;
    }
    return null; // If it's not an object, return null
  } catch (error) {
    return null; // Token is invalid or expired
  }
}
