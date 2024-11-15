import { JwtPayload } from "jsonwebtoken";

// extend payload to include user

export interface jwtUser {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  role: "user" | "critic";
}

interface JwtPayloadWithUser extends JwtPayload {
  user: jwtUser;
}

export default JwtPayloadWithUser;
