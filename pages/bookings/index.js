"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Table,
  Layout,
  Typography,
  Modal,
  Popconfirm,
  message,
} from "antd";
import moment from "moment";
import "antd/dist/reset.css";

const { Title } = Typography;
const { Content } = Layout;
const { Search } = Input;

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetch("/api/bookings")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((booking) => ({
          ...booking,
          date: moment(booking.date).format("YYYY-MM-DD"),
          time: moment(booking.time, "HH:mm:ss").format("HH:mm"),
        }));
        setBookings(formattedData);
        setFilteredBookings(formattedData);
      });
  }, []);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchValue) ||
        booking.voucherNumber.toLowerCase().includes(searchValue) ||
        booking.pickUpAddress.toLowerCase().includes(searchValue) ||
        booking.dropOffAddress.toLowerCase().includes(searchValue)
    );
    setFilteredBookings(filtered);
  };

  const handleSubmit = async (values) => {
    const date = values.date.format("YYYY-MM-DD");
    const time = values.time.format("HH:mm:ss");

    const dateTime = moment(`${date}T${time}`).toISOString();

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        date: dateTime, // Use the combined dateTime
      }),
    });

    if (response.ok) {
      const newBooking = await response.json();
      const formattedBooking = {
        ...newBooking,
        date: moment(newBooking.date).format("YYYY-MM-DD"),
        time: moment(newBooking.time, "HH:mm:ss").format("HH:mm"),
      };
      setBookings([...bookings, formattedBooking]);
      setFilteredBookings([...bookings, formattedBooking]);
      form.resetFields();
      setFormVisible(false);
    } else {
      message.error("Failed to add booking");
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    editForm.setFieldsValue({
      ...booking,
      date: moment(booking.date),
      time: moment(booking.time, "HH:mm"),
    });
    setEditVisible(true);
  };

  const handleUpdate = async (values) => {
    const date = values.date.format("YYYY-MM-DD");
    const time = values.time.format("HH:mm:ss");
    const dateTime = moment(`${date}T${time}`).toISOString();

    try {
      const response = await fetch(`/api/bookings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBooking.id, // Ensure the id is included
          ...values,
          date: dateTime,
        }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        const formattedBooking = {
          ...updatedBooking,
          date: moment(updatedBooking.date).format("YYYY-MM-DD"),
          // time: moment(updatedBooking.time, "HH:mm:ss").format("HH:mm"),
          time: moment(updatedBooking.date).format("HH:mm"),
        };
        const updatedBookings = bookings.map((booking) =>
          booking.id === updatedBooking.id ? formattedBooking : booking
        );
        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
        setEditVisible(false);
        setEditingBooking(null);
        message.success("Booking updated successfully");
      } else {
        message.error("Failed to update booking");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update booking");
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/bookings?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const updatedBookings = bookings.filter((booking) => booking.id !== id);
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
      message.success("Booking deleted successfully");
    } else {
      message.error("Failed to delete booking");
    }
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Name", dataIndex: "name", key: "name" },
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
          <Button type="link" onClick={() => handleEdit(record)}>
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
        <div className="text-center mb-8">
          <Button type="primary" onClick={() => setFormVisible(true)}>
            Add Booking
          </Button>
        </div>
        <div className="text-center mb-8">
          <Search
            placeholder="Search by name, voucher number, or address"
            onSearch={handleSearch}
            enterButton
            className="w-full"
          />
        </div>
        <Modal
          title="Add Booking"
          visible={formVisible}
          onCancel={() => setFormVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="bg-white p-8 rounded"
          >
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select the time!" }]}
            >
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter the name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="pickUpAddress"
              label="Pick Up Address"
              rules={[
                {
                  required: true,
                  message: "Please enter the pick up address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dropOffAddress"
              label="Drop Off Address"
              rules={[
                {
                  required: true,
                  message: "Please enter the drop off address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="driver"
              label="Driver"
              rules={[{ required: true, message: "Please enter the driver!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="comments" label="Comments">
              <Input />
            </Form.Item>
            <Form.Item
              name="agent"
              label="Agent"
              rules={[{ required: true, message: "Please enter the agent!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="voucherNumber"
              label="Voucher Number"
              rules={[
                { required: true, message: "Please enter the voucher number!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Add Booking
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Edit Booking"
          visible={editVisible}
          onCancel={() => setEditVisible(false)}
          footer={null}
        >
          <Form
            form={editForm}
            onFinish={handleUpdate}
            layout="vertical"
            className="bg-white p-8 rounded"
          >
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select the time!" }]}
            >
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter the name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="pickUpAddress"
              label="Pick Up Address"
              rules={[
                {
                  required: true,
                  message: "Please enter the pick up address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dropOffAddress"
              label="Drop Off Address"
              rules={[
                {
                  required: true,
                  message: "Please enter the drop off address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="driver"
              label="Driver"
              rules={[{ required: true, message: "Please enter the driver!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="comments" label="Comments">
              <Input />
            </Form.Item>
            <Form.Item
              name="agent"
              label="Agent"
              rules={[{ required: true, message: "Please enter the agent!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="voucherNumber"
              label="Voucher Number"
              rules={[
                { required: true, message: "Please enter the voucher number!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Update Booking
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          className="mt-12"
          dataSource={filteredBookings}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
        />
      </Content>
    </Layout>
  );
}
