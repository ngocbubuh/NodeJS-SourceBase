-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "avatar" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createBy" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateBy" TEXT,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "delFlag" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
