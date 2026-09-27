
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "loop-development-secret"
);

export type SessionUser = {
  id: string;
  email: string;
  role: "ADMIN" | "ANALYST" | "VIEWER";
  workspaceId: string;
};

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set("loop_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("loop_session")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, secret);

    return {
      id: String(payload.id),
      email: String(payload.email),
      role: payload.role as SessionUser["role"],
      workspaceId: String(payload.workspaceId),
    };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.set("loop_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}