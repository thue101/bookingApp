-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pickUpAddress" TEXT NOT NULL,
    "dropOffAddress" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "comments" TEXT,
    "agent" TEXT NOT NULL,
    "voucherNumber" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
