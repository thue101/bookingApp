import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Table,
  Layout,
  Typography,
  Drawer,
  Popconfirm,
  message,
} from "antd";
import moment from "moment";
import "antd/dist/reset.css";

const { Title } = Typography;
const { Content } = Layout;

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    fetch("/api/bookings")
      .then((response) => response.json())
      .then((data) => {
        setBookings(
          data.map((booking) => ({
            ...booking,
            date: moment(booking.date).format("YYYY-MM-DD"),
            time: moment(booking.time, "HH:mm").format("HH:mm"),
          }))
        );
      })
      .catch((error) => console.error("Failed to fetch bookings:", error));
  }, []);

  const toggleDrawer = (visible, record = {}) => {
    setDrawerVisible(visible);
    if (!visible) {
      form.resetFields();
      setEditingBooking({});
    } else {
      form.setFieldsValue({
        ...record,
        date: record.date ? moment(record.date) : null,
        time: record.time ? moment(record.time, "HH:mm") : null,
      });
      setEditingBooking(record);
    }
  };

  const handleSubmit = (values) => {
    const { date, time, ...rest } = values;
    const formattedDate = date.format("YYYY-MM-DD");
    const formattedTime = time.format("HH:mm");

    fetch(
      `/api/bookings${editingBooking.id ? `?id=${editingBooking.id}` : ""}`,
      {
        method: editingBooking.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          date: formattedDate,
          time: formattedTime,
          id: editingBooking.id ? parseInt(editingBooking.id) : undefined, // Ensure id is an integer
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const updatedBookings = editingBooking.id
          ? bookings.map((item) =>
              item.id === data.id
                ? {
                    ...item,
                    ...data,
                    date: moment(data.date).format("YYYY-MM-DD"),
                    time: data.time,
                  }
                : item
            )
          : [
              ...bookings,
              {
                ...data,
                date: moment(data.date).format("YYYY-MM-DD"),
                time: data.time,
              },
            ];
        setBookings(updatedBookings);
        toggleDrawer(false);
        message.success(
          `Booking ${editingBooking.id ? "updated" : "added"} successfully!`
        );
      })
      .catch((error) => {
        console.error("Failed to submit booking:", error);
        message.error(
          `Failed to ${editingBooking.id ? "update" : "add"} booking.`
        );
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/bookings?id=${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedBookings = bookings.filter((booking) => booking.id !== id);
        setBookings(updatedBookings);
        message.success("Booking deleted successfully!");
      })
      .catch((error) => {
        console.error("Failed to delete booking:", error);
        message.error("Failed to delete booking.");
      });
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Pick Up Address",
      dataIndex: "pickUpAddress",
      key: "pickUpAddress",
    },
    {
      title: "Drop Off Address",
      dataIndex: "dropOffAddress",
      key: "dropOffAddress",
    },
    { title: "Driver", dataIndex: "driver", key: "driver" },
    { title: "Comments", dataIndex: "comments", key: "comments" },
    { title: "Agent", dataIndex: "agent", key: "agent" },
    {
      title: "Voucher Number",
      dataIndex: "voucherNumber",
      key: "voucherNumber",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => toggleDrawer(true, record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this booking?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Content className="p-8">
        <Title className="text-center">Passion Wheels Bookings</Title>
        <Button
          type="primary"
          onClick={() => toggleDrawer(true)}
          style={{ marginBottom: 16 }}
        >
          Add Booking
        </Button>
        <Table
          dataSource={bookings}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
        />
        <Drawer
          title={editingBooking.id ? "Edit Booking" : "Add Booking"}
          width={720}
          onClose={() => toggleDrawer(false)}
          visible={drawerVisible}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date" }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select the time" }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="contact"
              label="Contact"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="pickUpAddress"
              label="Pick Up Address"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dropOffAddress"
              label="Drop Off Address"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="driver"
              label="Driver"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="agent" label="Agent" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="voucherNumber"
              label="Voucher Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="comments" label="Comments">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingBooking.id ? "Update" : "Add"} Booking
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </Content>
    </Layout>
  );
}
