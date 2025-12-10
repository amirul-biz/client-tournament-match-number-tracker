-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
