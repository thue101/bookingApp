import React, { useState, useEffect } from "react";
import { Layout, Typography, List, Calendar, Modal } from "antd";
import moment from "moment";
import "antd/dist/reset.css"; // Ensure to include antd reset CSS

const { Title } = Typography;
const { Content } = Layout;

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dailyBookings, setDailyBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((response) => response.json())
      .then((data) => {
        setBookings(
          data.map((booking) => ({
            ...booking,
            date: moment(booking.date).format("YYYY-MM-DD"), // Adjust formatting as needed
            time: moment(booking.date).format("HH:mm"), // Adjust time extraction as per your data structure
          }))
        );
      })
      .catch((error) => console.error("Failed to fetch bookings:", error));
  }, []);

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const count = bookings.filter(
      (booking) => booking.date === formattedDate
    ).length;
    return (
      <div className="calendar-date">
        {count > 0 && (
          <div className="bookings-count">
            {count} booking{count > 1 ? "s" : ""}
          </div>
        )}
      </div>
    );
  };

  const onSelect = (value) => {
    setSelectedDate(value);
    const formattedDate = value.format("YYYY-MM-DD");
    const filteredBookings = bookings.filter(
      (booking) => booking.date === formattedDate
    );
    setDailyBookings(filteredBookings);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout className="site-layout-background" style={{ padding: "24px" }}>
      <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
        <Title level={2}>Dashboard - Daily Bookings</Title>
        <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />
        <Modal
          title={`Bookings for ${selectedDate.format("YYYY-MM-DD")}`}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <List
            itemLayout="horizontal"
            dataSource={dailyBookings}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`Time: ${item.time}, Pick up: ${item.pickUpAddress}`}
                />
              </List.Item>
            )}
          />
        </Modal>
      </Content>
    </Layout>
  );
}
