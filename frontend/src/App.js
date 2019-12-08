import React, { useState } from "react";
import { Typography, Layout, Menu, Icon } from "antd";

import Dashboard from "./pages/Dashboard";
import Historico from "./pages/Historico";

import "./App.css";
import "antd/dist/antd.css";

const { Content, Footer, Sider } = Layout;
const { Title } = Typography;

function App() {
  const [menuCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  function handleMenuClick(e) {
    setSelectedMenu(e.key);
  }

  return (
    <div id="app" className="App">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsed={menuCollapsed}>
          <div className="logo">
            <Title
              level={1}
              style={{ color: "white", marginTop: 15, textAlign: "center" }}
            >
              Niwa
            </Title>
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={["dashboard"]}
            selectedKeys={[selectedMenu]}
            mode="inline"
            onClick={handleMenuClick}
          >
            <Menu.Item key="dashboard">
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>
            <Menu.Item key="historico">
              <Icon type="line-chart" />
              <span>Histórico</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "0 15px", marginTop: "10px" }}>
            {selectedMenu === "dashboard" ? <Dashboard /> : <Historico />}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            UTFPR - Microcontroladores 2019
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
