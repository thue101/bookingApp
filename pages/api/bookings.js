import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      // Handle GET request - Fetch all bookings
      try {
        const bookings = await prisma.booking.findMany();
        res.status(200).json(bookings);
      } catch (error) {
        console.error("GET error:", error);
        res.status(500).json({ message: "Unable to fetch bookings." });
      }
      break;

    case "POST":
      // Handle POST request - Create a new booking
      try {
        const { date, time, ...otherDetails } = req.body;
        const formattedDate = new Date(`${date}T${time}`);

        const booking = await prisma.booking.create({
          data: {
            ...otherDetails,
            date: formattedDate,
          },
        });
        res.status(201).json(booking);
      } catch (error) {
        console.error("POST error:", error);
        res.status(500).json({ message: "Failed to create booking." });
      }
      break;

    case "PUT":
      // Handle PUT request - Update an existing booking
      try {
        const { id, date, ...otherData } = req.body;
        if (!id) {
          return res.status(400).json({ message: "ID is required" });
        }
        const formattedDate = new Date(date);

        if (isNaN(formattedDate)) {
          throw new Error("Invalid Date");
        }

        const booking = await prisma.booking.update({
          where: { id: parseInt(id) },
          data: {
            ...otherData,
            date: formattedDate,
          },
        });
        res.status(200).json(booking);
      } catch (error) {
        console.error("PUT error:", error);
        res
          .status(500)
          .json({ message: `Failed to update booking. ${error.message}` });
      }
      break;

    case "DELETE":
      // Handle DELETE request - Delete a booking
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
      // Handle any other HTTP method
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
