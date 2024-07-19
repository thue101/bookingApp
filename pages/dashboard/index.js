import React, { useState, useEffect } from "react";
import { List, Typography, Card } from "antd";
import axios from "axios";
import moment from "moment";

const { Title } = Typography;

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch bookings data from the API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/bookings");
        const validBookings = response.data
          .map((booking) => ({
            ...booking,
            date: moment(booking.date),
            time: moment(booking.time, "HH:mm:ss"),
          }))
          .filter((booking) => booking.date.isSameOrAfter(moment(), "day")) // Filter for today and future bookings
          .sort((a, b) => a.date.diff(b.date) || a.time.diff(b.time)); // Sort by date and then time
        setBookings(validBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <Title level={2}>Current and Upcoming Bookings</Title>
      <List
        dataSource={bookings}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={`Booking on ${item.date.format(
                "YYYY-MM-DD"
              )} at ${item.time.format("HH:mm")}`}
              style={{ width: "100%" }}
            >
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Pick Up:</strong> {item.pickUpAddress}
              </p>
              <p>
                <strong>Drop Off:</strong> {item.dropOffAddress}
              </p>
              <p>
                <strong>Driver:</strong> {item.driver}
              </p>
              <p>
                <strong>Comments:</strong> {item.comments || "N/A"}
              </p>
              <p>
                <strong>Agent:</strong> {item.agent}
              </p>
              <p>
                <strong>Voucher Number:</strong> {item.voucherNumber}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Dashboard;
