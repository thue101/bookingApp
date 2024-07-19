import "antd/dist/reset.css";
import "../styles/globals.css";
import { Layout, Menu, Typography } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  DashboardOutlined,
  CarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function MyApp({ Component, pageProps }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "bookings", icon: <CarOutlined />, label: "Bookings" },
    { key: "drivers", icon: <TeamOutlined />, label: "Drivers" },
    { key: "accounts", icon: <UserOutlined />, label: "Accounts" },
  ];

  const handleMenuClick = (e) => {
    router.push(`/${e.key}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Title level={2} style={{ margin: "16px" }}>
            Passion Wheels
          </Title>
        </Header>
        <Content style={{ margin: "16px" }}>
          <Component {...pageProps} />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MyApp;
