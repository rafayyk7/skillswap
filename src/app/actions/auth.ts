"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  clearSessionCookie,
  getSession,
} from "@/lib/api/auth";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/api/validations";
import {
  createUser,
  verifyEmail,
  createPasswordResetToken,
  resetPassword,
} from "@/lib/services/users";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    displayName: formData.get("displayName") as string,
    username: formData.get("username") as string,
  };

  const validation = signupSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return {
      error: firstError?.message || "Invalid input",
    };
  }

  try {
    const result = await createUser(validation.data);
    return {
      success: true,
      user: result.user,
      // In production, send verification email instead
      verificationToken: result.verificationToken,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function login(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validation = loginSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return {
      error: firstError?.message || "Invalid input",
    };
  }

  try {
    const { email, password } = validation.data;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
        status: users.status,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user || !user.passwordHash) {
      return { error: "Invalid email or password" };
    }

    if (user.status === "suspended") {
      return { error: "Your account has been suspended" };
    }

    if (user.status === "deleted") {
      return { error: "Account not found" };
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return { error: "Invalid email or password" };
    }

    // Create session
    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);

    // Update last active
    await db
      .update(users)
      .set({ lastActiveAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id));

    return {
      success: true,
      emailVerified: user.emailVerified,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to log in",
    };
  }
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}

export async function verifyEmailAction(token: string) {
  try {
    await verifyEmail(token);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to verify email",
    };
  }
}

export async function forgotPassword(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
  };

  const validation = forgotPasswordSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return {
      error: firstError?.message || "Invalid input",
    };
  }

  try {
    const token = await createPasswordResetToken(validation.data.email);
    // In production, send email with reset link
    return {
      success: true,
      // Only return token in development
      token: process.env.NODE_ENV === "development" ? token : undefined,
    };
  } catch {
    // Don't reveal if email exists
    return { success: true };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const rawData = {
    token: formData.get("token") as string,
    password: formData.get("password") as string,
  };

  const validation = resetPasswordSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return {
      error: firstError?.message || "Invalid input",
    };
  }

  try {
    await resetPassword(validation.data.token, validation.data.password);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}

export async function getCurrentSession() {
  return getSession();
}

