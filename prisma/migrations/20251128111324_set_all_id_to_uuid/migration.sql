/*
  Warnings:

  - The primary key for the `Status` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TeamMatch` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_statusId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMatch" DROP CONSTRAINT "TeamMatch_teamId_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "statusId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Status" DROP CONSTRAINT "Status_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Status_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Status_id_seq";

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Team_id_seq";

-- AlterTable
ALTER TABLE "TeamMatch" DROP CONSTRAINT "TeamMatch_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "teamId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TeamMatch_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TeamMatch_id_seq";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMatch" ADD CONSTRAINT "TeamMatch_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
