import { PrismaClient } from '@prisma/client'

declare global {
  namespace PrismaClient {
    interface TypeMap {
      user: {
        findUnique: (args: any) => Promise<any>
      }
      deck: {
        findMany: (args: any) => Promise<any>
        create: (args: any) => Promise<any>
        delete: (args: any) => Promise<any>
      }
      flashcard: {
        deleteMany: (args: any) => Promise<any>
      }
    }
  }
} 