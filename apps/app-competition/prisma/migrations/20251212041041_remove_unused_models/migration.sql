-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT IF EXISTS "Match_arenaId_fkey";
ALTER TABLE "Match" DROP CONSTRAINT IF EXISTS "Match_statusId_fkey";
ALTER TABLE "TeamMatch" DROP CONSTRAINT IF EXISTS "TeamMatch_matchId_fkey";
ALTER TABLE "TeamMatch" DROP CONSTRAINT IF EXISTS "TeamMatch_teamId_fkey";

-- DropTable
DROP TABLE IF EXISTS "Match";
DROP TABLE IF EXISTS "Status";
DROP TABLE IF EXISTS "TeamMatch";

-- CreateIndex (if not exists)
CREATE INDEX IF NOT EXISTS "Arena_id_idx" ON "Arena"("id");

-- AlterTable Team (ensure userId column exists with proper index)
-- The userId column should already exist from previous migrations
-- Just ensure the index exists
CREATE INDEX IF NOT EXISTS "Team_userId_idx" ON "Team"("userId");
