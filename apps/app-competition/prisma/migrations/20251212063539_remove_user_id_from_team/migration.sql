-- DropIndex
DROP INDEX IF EXISTS "Team_userId_idx";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN IF EXISTS "userId";
