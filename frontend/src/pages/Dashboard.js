import React, { useEffect, useState } from "react";
import {
  Statistic,
  Row,
  Col,
  Icon,
  Typography,
  Button,
  InputNumber,
  message
} from "antd";
import moment from "moment";

// import data from "../data/line.json";
import { LinePlot } from "../components/LinePlot.js";
import { getCurrentTemperature } from "../services/temperature.js";
import { getCurrentHumidity } from "../services/humidity.js";
import { turnPumpOnFor, turnPump } from "../services/pump.js";

const MAX_PLOT_POINTS = 5;
const UPDATE_INTERVAL = 10000; // ms

function Dashboard() {
  const [temperature, setTemperature] = useState(0.0);
  const [humidity, setHumidity] = useState(0.0);
  const [tempPoints, setTempPoints] = useState([]);
  const [humPoints, setHumPoints] = useState([]);
  const [numOfSecs, setNumOfSecs] = useState(3);
  const [pumpOn, setPumpOn] = useState(false);

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
    const timer = setInterval(updateTempAndHumidity, UPDATE_INTERVAL);
    return () => timer;
  }, []);

  function handlePumpOnClick() {
    turnPumpOnFor(numOfSecs, handlePumpOffClick);
    setPumpOn(true);
    message.success("Bomba ativada", 1);
  }

  function handlePumpOffClick() {
    turnPump("off");
    setPumpOn(false);
    message.error("Bomba desativada", 1);
  }

  const plotTempPoints = [
    {
      id: "Temperatura",
      data:
        tempPoints.length > MAX_PLOT_POINTS
          ? tempPoints.slice(tempPoints.length - MAX_PLOT_POINTS)
          : tempPoints
    }
  ];

  const plotHumPoints = [
    {
      id: "Umidade",
      data:
        humPoints.length > MAX_PLOT_POINTS
          ? humPoints.slice(humPoints.length - MAX_PLOT_POINTS)
          : humPoints
    }
  ];

  return (
    <div style={{ padding: 20, background: "#fff", minHeight: 360 }}>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Row type="flex" justify="start">
        <Col span={12}>
          <Statistic
            title="Temperatura atual"
            value={temperature}
            suffix="°C"
            prefix={<Icon type="fire" />}
            precision={2}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Umidade atual"
            value={humidity}
            prefix={<Icon type="experiment" />}
            suffix="%"
            precision={2}
          />
        </Col>
      </Row>
      <Row type="flex" justify="space-between">
        <Col span={12} style={{ height: 290 }}>
          <LinePlot
            data={plotTempPoints}
            yAxisLabel="Temperatura"
            yAxisMax={"40"}
            colorScheme={"red_blue"}
          />
        </Col>
        <Col span={12} style={{ height: 290 }}>
          <LinePlot
            data={plotHumPoints}
            yAxisLabel="Umidade"
            yAxisMax={"100"}
            colorScheme={"dark2"}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Typography.Title level={4}>Bomba de Água</Typography.Title>
      </Row>
      <Row>
        Status: <b>{pumpOn ? "Ligada" : "Desligada"}</b>
      </Row>
      <Row type="flex" justify="start" style={{ marginTop: 15 }}>
        <Col span={1}>
          <InputNumber
            min={1}
            max={10}
            defaultValue={3}
            onChange={v => setNumOfSecs(v)}
          />
        </Col>
        <Col style={{ marginLeft: 80 }}>
          {!pumpOn ? (
            <Button type="primary" onClick={handlePumpOnClick}>
              Ativar bomba de água por {numOfSecs} segundos
            </Button>
          ) : (
            <Button type="primary" onClick={handlePumpOffClick}>
              Desligar bomba
            </Button>
          )}
        </Col>
      </Row>
      <Row type="flex" style={{ marginTop: 15 }}></Row>
    </div>
  );
}

export default Dashboard;
