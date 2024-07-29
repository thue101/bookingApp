import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const bookings = await prisma.booking.findMany();
        res.status(200).json(bookings);
      } catch (error) {
        console.error("GET error:", error);
        res.status(500).json({ message: "Unable to fetch bookings." });
      }
      break;

    case "POST":
      try {
        const { date, time, ...otherDetails } = req.body;
        const booking = await prisma.booking.create({
          data: {
            date: new Date(date), // Convert date string to Date object
            time,
            ...otherDetails,
          },
        });
        res.status(201).json(booking);
      } catch (error) {
        console.error("POST error:", error);
        res.status(500).json({ message: "Failed to create booking." });
      }
      break;

    case "PUT":
      try {
        const { id, date, time, ...otherData } = req.body;
        const booking = await prisma.booking.update({
          where: { id: parseInt(id) },
          data: {
            date: new Date(date), // Convert date string to Date object
            time,
            ...otherData,
          },
        });
        res.status(200).json(booking);
      } catch (error) {
        console.error("PUT error:", error);
        res.status(500).json({ message: "Failed to update booking." });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;
        await prisma.booking.delete({
          where: { id: parseInt(id) },
        });
        res.status(204).send();
      } catch (error) {
        console.error("DELETE error:", error);
        res.status(500).json({ message: "Failed to delete booking." });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
