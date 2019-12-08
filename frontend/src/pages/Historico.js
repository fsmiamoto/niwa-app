import React from "react";
import { Typography, Tabs } from "antd";
import { PlotTemp } from "../components/PlotTemp";
import { PlotHum } from "../components/PlotHum";

const { TabPane } = Tabs;

function Historico() {
  return (
    <div style={{ padding: 20, background: "#fff", minHeight: 360 }}>
      <Typography.Title level={3}>Histórico</Typography.Title>
      <Tabs>
        <TabPane key="temp" tab="Temperatura">
          <PlotTemp />
        </TabPane>
        <TabPane key="hum" tab="Umidade">
          <PlotHum />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Historico;
