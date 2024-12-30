/*
  Warnings:

  - The primary key for the `Flashcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Flashcard` table. All the data in the column will be lost.
  - The primary key for the `FlashcardSet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FlashcardSet` table. All the data in the column will be lost.
  - The required column `flashcardId` was added to the `Flashcard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `setId` was added to the `FlashcardSet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_setId_fkey";

-- AlterTable
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_pkey",
DROP COLUMN "id",
ADD COLUMN     "flashcardId" TEXT NOT NULL,
ALTER COLUMN "setId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("flashcardId");

-- AlterTable
ALTER TABLE "FlashcardSet" DROP CONSTRAINT "FlashcardSet_pkey",
DROP COLUMN "id",
ADD COLUMN     "setId" TEXT NOT NULL,
ADD CONSTRAINT "FlashcardSet_pkey" PRIMARY KEY ("setId");

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_setId_fkey" FOREIGN KEY ("setId") REFERENCES "FlashcardSet"("setId") ON DELETE RESTRICT ON UPDATE CASCADE;
