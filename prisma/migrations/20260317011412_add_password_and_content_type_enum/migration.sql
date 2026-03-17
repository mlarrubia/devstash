/*
  Warnings:

  - Changed the type of `contentType` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('TEXT', 'URL', 'FILE');

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "contentType",
ADD COLUMN     "contentType" "ContentType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
