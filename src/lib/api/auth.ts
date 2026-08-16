import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/db";
import { users, sessions, profiles } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "skillswap-secret-key-change-in-production"
);

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface SessionUser {
  id: string;
  email: string;
  role: "user" | "admin";
  status: "pending" | "active" | "suspended" | "deleted";
  emailVerified: boolean;
}

export interface Session {
  user: SessionUser;
  token: string;
  expiresAt: Date;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create JWT token
export async function createJWT(payload: {
  userId: string;
  sessionId: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyJWT(
  token: string
): Promise<{ userId: string; sessionId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return payload as {
      userId: string;
      sessionId: string;
    };
  } catch {
    return null;
  }
}

// Create a new session
export async function createSession(
  userId: string
): Promise<{ token: string; expiresAt: Date }> {
  const sessionToken = generateToken(64);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const [session] = await db
    .insert(sessions)
    .values({
      userId,
      token: sessionToken,
      expiresAt,
    })
    .returning();

  const jwt = await createJWT({
    userId,
    sessionId: session.id,
  });

  return {
    token: jwt,
    expiresAt,
  };
}

// Get current session from cookies
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return null;
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, payload.sessionId),
        eq(sessions.userId, payload.userId),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!session) {
    return null;
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (
    !user ||
    user.status === "deleted" ||
    user.status === "suspended"
  ) {
    return null;
  }

  return {
    user,
    token,
    expiresAt: session.expiresAt,
  };
}

// Get current user with profile
export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const [userWithProfile] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
      emailVerified: users.emailVerified,
      profile: {
        id: profiles.id,
        username: profiles.username,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        country: profiles.country,
        timezone: profiles.timezone,
        experienceSummary: profiles.experienceSummary,
      },
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, session.user.id))
    .limit(1);

  return userWithProfile;
}

// Set session cookie
export async function setSessionCookie(
  token: string,
  expiresAt: Date
) {
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// Invalidate session
export async function invalidateSession(sessionId: string) {
  await db
    .delete(sessions)
    .where(eq(sessions.id, sessionId));
}

// Invalidate all sessions for a user
export async function invalidateAllSessions(userId: string) {
  await db
    .delete(sessions)
    .where(eq(sessions.userId, userId));
}

// Update last active timestamp
export async function updateLastActive(userId: string) {
  await db
    .update(users)
    .set({
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user.role === "admin";
}

// Require authentication
export async function requireAuth(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

// Require admin role
export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth();

  if (session.user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return session;
}
