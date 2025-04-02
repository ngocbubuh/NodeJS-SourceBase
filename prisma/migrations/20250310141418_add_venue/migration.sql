-- CreateTable
CREATE TABLE "venue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TEXT,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("id")
);
