import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      const bookings = await prisma.booking.findMany();
      res.status(200).json(bookings);
      break;

    case "POST":
      const newBooking = await prisma.booking.create({
        data: {
          ...req.body,
          date: new Date(req.body.date), // Ensure the date is properly parsed
        },
      });
      res.status(201).json(newBooking);
      break;

    case "PUT":
      const updatedBooking = await prisma.booking.update({
        where: { id: parseInt(id) },
        data: {
          ...req.body,
          date: new Date(req.body.date), // Ensure the date is properly parsed
        },
      });
      res.status(200).json(updatedBooking);
      break;

    case "DELETE":
      await prisma.booking.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
