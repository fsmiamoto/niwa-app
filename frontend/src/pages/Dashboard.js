import React, { useEffect, useState } from "react";
import { Statistic, Row, Col } from "antd";
import moment from "moment";

// import data from "../data/line.json";
import { LinePlot } from "../components/LinePlot.js";
import { getCurrentTemperature } from "../services/temperature.js";
import { getCurrentHumidity } from "../services/humidity.js";

function Dashboard() {
  const [temperature, setTemperature] = useState(0.0);
  const [humidity, setHumidity] = useState(0.0);
  const [tempPoints, setTempPoints] = useState([]);
  const [humPoints, setHumPoints] = useState([]);

  async function updateTempAndHumidity() {
    const [temp, hum] = await Promise.all([
      getCurrentTemperature(),
      getCurrentHumidity()
    ]);

    const now = moment();

    if (temp > -255 && temp <= 40) {
      setTemperature(temp);
      setTempPoints(tempPoints =>
        tempPoints.concat({ x: now.format("h:mm:ss"), y: temp.toFixed(2) })
      );
    }
    if (hum !== -255) {
      setHumidity(hum);
      setHumPoints(humPoints =>
        humPoints.concat({ x: now.format("h:mm:ss"), y: hum.toFixed(2) })
      );
    }
  }

  useEffect(() => {
    updateTempAndHumidity();
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTempAndHumidity, 3000);
    return () => timer;
  }, []);

  const plotTempPoints = [
    {
      id: "Temperatura",
      color: "red",
      data:
        tempPoints.length > 10
          ? tempPoints.slice(tempPoints.length - 10)
          : tempPoints
    }
  ];

  const plotHumPoints = [
    {
      id: "Umidade",
      color: "#231021",
      data:
        humPoints.length > 10
          ? humPoints.slice(humPoints.length - 10)
          : humPoints
    }
  ];

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
          <LinePlot data={plotTempPoints} yAxisLabel="Temperatura" />
        </Col>
      </Row>
      <Row type="flex">
        <Col span={24} style={{ height: 300 }}>
          <LinePlot data={plotHumPoints} yAxisLabel="Umidade" />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
