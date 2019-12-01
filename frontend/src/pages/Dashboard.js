import React, { useEffect, useState } from "react";
import { Statistic, Row, Col } from "antd";

import data from "../data/line.json";
import { LinePlot } from "../components/LinePlot.js";
import { getCurrentTemperature } from "../services/temperature.js";
import { getCurrentHumidity } from "../services/humidity.js";

function Dashboard() {
  const [temperature, setTemperature] = useState(0.0);
  const [humidity, setHumidity] = useState(0.0);

  async function updateTempAndHumidity() {
    const [temp, hum] = await Promise.all([
      getCurrentTemperature(),
      getCurrentHumidity()
    ]);
    setTemperature(temp);
    setHumidity(hum);
  }

  useEffect(() => {
    updateTempAndHumidity();
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateTempAndHumidity, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
      <Row type="flex" justify="space-around">
        <Col span={12}>
          <Statistic
            title="Temperatura atual"
            value={temperature}
            suffix=" °C"
            precision={2}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Umidade atual"
            value={humidity}
            suffix=" %"
            precision={2}
          />
        </Col>
      </Row>
      <Row type="flex">
        <Col span={24} style={{ height: 300 }}>
          <LinePlot data={data} yAxisLabel="Temperatura" />
        </Col>
      </Row>
      <Row type="flex">
        <Col span={24} style={{ height: 300 }}>
          <LinePlot data={data} yAxisLabel="Umidade" />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
