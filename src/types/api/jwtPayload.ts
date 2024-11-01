import { JwtPayload } from "jsonwebtoken";

// extend payload to include user

export interface jwtUser {
  email: string;
  role: "user" | "critic";
}

interface JwtPayloadWithUser extends JwtPayload {
  user: jwtUser;
}

export default JwtPayloadWithUser;
