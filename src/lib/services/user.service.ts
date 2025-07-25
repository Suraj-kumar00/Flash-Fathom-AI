import { prisma } from '@/lib/database';
import { auth, currentUser } from '@clerk/nextjs/server';

export class UserService {
  /**
   * Ensure user exists in Supabase database with REAL Clerk data (no dummy users)
   */
  async ensureUserExists(userId: string): Promise<void> {
    try {
      console.log(`🔍 Checking if user exists: ${userId}`);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });

      if (existingUser) {
        console.log(`✅ User already exists: ${userId}`);
        return;
      }

      // ✅ NO DUMMY USERS: Always fetch real data from Clerk
      console.log(`👤 User not found in database. Fetching real data from Clerk...`);
      
      // Get REAL user data from Clerk
      const clerkUser = await currentUser();
      if (!clerkUser) {
        throw new Error('Failed to fetch user data from Clerk. User might not be properly authenticated.');
      }

      // Validate that we have the correct user
      if (clerkUser.id !== userId) {
        throw new Error('User ID mismatch between auth and currentUser');
      }

      // ✅ FIXED: Match your exact schema structure
      const newUser = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser.primaryEmailAddress?.emailAddress || `${userId}@clerk.local`, // Handle unique constraint
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          // Note: imageUrl not in schema - removed
          // createdAt and updatedAt are auto-handled by Prisma
        }
      });

      console.log(`✅ Created user record with REAL Clerk data:`, {
        id: newUser.clerkUserId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      });

    } catch (error) {
      console.error('❌ Error ensuring user exists with Clerk data:', error);
      
      // ✅ ENHANCED: Handle unique constraint violations for email
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        console.log('🔄 Email already exists, attempting to find existing user...');
        // Try to find user by email if clerkUserId lookup failed but email exists
        try {
          const userByEmail = await prisma.user.findUnique({
            where: { email: (await currentUser())?.primaryEmailAddress?.emailAddress || '' }
          });
          if (userByEmail && userByEmail.clerkUserId !== userId) {
            // Update existing user with correct clerkUserId
            await prisma.user.update({
              where: { email: userByEmail.email },
              data: { clerkUserId: userId }
            });
            console.log('✅ Updated existing user with correct clerkUserId');
            return;
          }
        } catch (updateError) {
          console.error('❌ Failed to handle duplicate email:', updateError);
        }
      }
      
      throw new Error(`Failed to create user record with Clerk data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Full sync with Clerk user data (get latest info and update database)
   */
  async syncUserFromClerk(): Promise<string> {
    try {
      // Get current authenticated user ID
      const { userId } = await auth();
      if (!userId) {
        throw new Error('No authenticated user found');
      }

      // Get REAL user data from Clerk
      const clerkUser = await currentUser();
      if (!clerkUser) {
        throw new Error('Failed to fetch user data from Clerk');
      }

      // Validate user ID consistency
      if (clerkUser.id !== userId) {
        throw new Error('User ID mismatch between auth and currentUser');
      }

      console.log(`🔄 Syncing user with REAL Clerk data:`, {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName
      });

      // ✅ FIXED: Match your exact schema structure
      const user = await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: {
          email: clerkUser.primaryEmailAddress?.emailAddress || `${userId}@clerk.local`,
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          // updatedAt is auto-handled by Prisma
        },
        create: {
          clerkUserId: userId,
          email: clerkUser.primaryEmailAddress?.emailAddress || `${userId}@clerk.local`,
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          // createdAt and updatedAt are auto-handled by Prisma
        }
      });

      console.log(`✅ User synced completely with REAL data:`, {
        id: user.clerkUserId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });

      return user.clerkUserId;
    } catch (error) {
      console.error('❌ Error syncing user from Clerk:', error);
      throw new Error(`Failed to sync user data from Clerk: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user's full name from firstName and lastName
   */
  async getUserDisplayName(userId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { firstName: true, lastName: true, email: true }
      });

      if (!user) {
        return 'User';
      }

      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      return fullName || user.email?.split('@')[0] || 'User';
    } catch (error) {
      console.error('❌ Error getting user display name:', error);
      return 'User';
    }
  }

  /**
   * Check if user exists in database without creating
   */
  async checkUserExists(userId: string): Promise<boolean> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });
      return !!existingUser;
    } catch (error) {
      console.error('❌ Error checking if user exists:', error);
      return false;
    }
  }

  /**
   * Get user by clerkUserId with all details
   */
  async getUserByClerkId(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        include: {
          decks: {
            include: {
              flashcards: true
            }
          },
          flashcards: true,
          studySessions: {
            include: {
              records: true
            }
          }
        }
      });

      return user;
    } catch (error) {
      console.error('❌ Error getting user details:', error);
      throw new Error('Failed to fetch user details');
    }
  }
}

export const userService = new UserService();
