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
