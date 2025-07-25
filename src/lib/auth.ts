import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    console.warn("No user ID found in session.");
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function getUserByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkId },
  });

  return user;
}
