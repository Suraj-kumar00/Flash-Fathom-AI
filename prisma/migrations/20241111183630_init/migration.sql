/*
  Warnings:

  - The primary key for the `Flashcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `flashcardId` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `setId` on the `Flashcard` table. All the data in the column will be lost.
  - The primary key for the `FlashcardSet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `setId` on the `FlashcardSet` table. All the data in the column will be lost.
  - You are about to drop the column `setName` on the `FlashcardSet` table. All the data in the column will be lost.
  - Added the required column `flashcardSetId` to the `Flashcard` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Flashcard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `FlashcardSet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `FlashcardSet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_setId_fkey";

-- AlterTable
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_pkey",
DROP COLUMN "flashcardId",
DROP COLUMN "setId",
ADD COLUMN     "flashcardSetId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FlashcardSet" DROP CONSTRAINT "FlashcardSet_pkey",
DROP COLUMN "setId",
DROP COLUMN "setName",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "FlashcardSet_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Flashcard_flashcardSetId_idx" ON "Flashcard"("flashcardSetId");

-- CreateIndex
CREATE INDEX "FlashcardSet_userId_idx" ON "FlashcardSet"("userId");

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_flashcardSetId_fkey" FOREIGN KEY ("flashcardSetId") REFERENCES "FlashcardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
