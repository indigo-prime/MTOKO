-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Mood" AS ENUM ('RELAXED', 'ROMANTIC', 'ADVENTUROUS', 'FAMILY_FRIENDLY', 'BUSINESS', 'HISTORICAL', 'SHOPPING', 'EDUCATIONAL', 'CULTURAL');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."MainCategoryEnum" AS ENUM ('FOOD_PACK', 'FAMILY_AND_KIDS', 'NIGHT_LIFE', 'ARTS_AND_CULTURE', 'NATURE_AND_OUTDOOR', 'SHOPPING_AND_LIFESTYLE', 'EVENTS_AND_EXPERIENCE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "public"."Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "public"."Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "moods" "public"."Mood"[],
    "imageUrls" TEXT[],
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."placelike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placelike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rule" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."savedplace" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "savedplace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "tags" TEXT[],
    "placeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "public"."BookingStatus",
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MainCategory" (
    "id" TEXT NOT NULL,
    "name" "public"."MainCategoryEnum" NOT NULL,

    CONSTRAINT "MainCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "mainCategoryId" TEXT NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaceMainCategory" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "mainCategoryId" TEXT NOT NULL,

    CONSTRAINT "PlaceMainCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaceSubCategory" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "PlaceSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "public"."Authenticator"("credentialID");

-- CreateIndex
CREATE INDEX "Authenticator_userId_idx" ON "public"."Authenticator"("userId");

-- CreateIndex
CREATE INDEX "Place_ownerId_idx" ON "public"."Place"("ownerId");

-- CreateIndex
CREATE INDEX "Place_location_idx" ON "public"."Place"("location");

-- CreateIndex
CREATE INDEX "placelike_userId_idx" ON "public"."placelike"("userId");

-- CreateIndex
CREATE INDEX "placelike_placeId_idx" ON "public"."placelike"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "placelike_userId_placeId_key" ON "public"."placelike"("userId", "placeId");

-- CreateIndex
CREATE INDEX "Feature_placeId_idx" ON "public"."Feature"("placeId");

-- CreateIndex
CREATE INDEX "Rule_placeId_idx" ON "public"."Rule"("placeId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "public"."Review"("userId");

-- CreateIndex
CREATE INDEX "Review_placeId_idx" ON "public"."Review"("placeId");

-- CreateIndex
CREATE INDEX "Review_parent_id_idx" ON "public"."Review"("parent_id");

-- CreateIndex
CREATE INDEX "savedplace_userId_idx" ON "public"."savedplace"("userId");

-- CreateIndex
CREATE INDEX "savedplace_placeId_idx" ON "public"."savedplace"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "savedplace_userId_placeId_key" ON "public"."savedplace"("userId", "placeId");

-- CreateIndex
CREATE INDEX "MenuItem_placeId_idx" ON "public"."MenuItem"("placeId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "public"."Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_placeId_idx" ON "public"."Booking"("placeId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "public"."Booking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_placeId_date_key" ON "public"."Booking"("userId", "placeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MainCategory_name_key" ON "public"."MainCategory"("name");

-- CreateIndex
CREATE INDEX "MainCategory_name_idx" ON "public"."MainCategory"("name");

-- CreateIndex
CREATE INDEX "SubCategory_mainCategoryId_idx" ON "public"."SubCategory"("mainCategoryId");

-- CreateIndex
CREATE INDEX "SubCategory_name_idx" ON "public"."SubCategory"("name");

-- CreateIndex
CREATE INDEX "PlaceMainCategory_placeId_idx" ON "public"."PlaceMainCategory"("placeId");

-- CreateIndex
CREATE INDEX "PlaceMainCategory_mainCategoryId_idx" ON "public"."PlaceMainCategory"("mainCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceMainCategory_placeId_mainCategoryId_key" ON "public"."PlaceMainCategory"("placeId", "mainCategoryId");

-- CreateIndex
CREATE INDEX "PlaceSubCategory_placeId_idx" ON "public"."PlaceSubCategory"("placeId");

-- CreateIndex
CREATE INDEX "PlaceSubCategory_subCategoryId_idx" ON "public"."PlaceSubCategory"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceSubCategory_placeId_subCategoryId_key" ON "public"."PlaceSubCategory"("placeId", "subCategoryId");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Place" ADD CONSTRAINT "Place_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."placelike" ADD CONSTRAINT "placelike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."placelike" ADD CONSTRAINT "placelike_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feature" ADD CONSTRAINT "Feature_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rule" ADD CONSTRAINT "Rule_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."savedplace" ADD CONSTRAINT "savedplace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."savedplace" ADD CONSTRAINT "savedplace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuItem" ADD CONSTRAINT "MenuItem_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubCategory" ADD CONSTRAINT "SubCategory_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "public"."MainCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceMainCategory" ADD CONSTRAINT "PlaceMainCategory_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceMainCategory" ADD CONSTRAINT "PlaceMainCategory_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "public"."MainCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceSubCategory" ADD CONSTRAINT "PlaceSubCategory_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceSubCategory" ADD CONSTRAINT "PlaceSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "public"."SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
