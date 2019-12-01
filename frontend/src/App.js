import React, { useState } from "react";
import { Typography, Layout, Menu, Icon } from "antd";

import Dashboard from "./pages/Dashboard";

import "./App.css";
import "antd/dist/antd.css";

const { Content, Footer, Sider } = Layout;
const { Title } = Typography;

function App() {
  const [menuCollapsed] = useState(false);

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
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "0 16px", marginTop: "10px" }}>
            <Dashboard />
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
