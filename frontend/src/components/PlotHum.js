import React, { useEffect, useState } from "react";
import { LinePlot } from "./LinePlot";
import { getHumPoints } from "../services/humidity";

export function PlotHum() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    async function fetchPoints() {
      const data = await getHumPoints();
      setPoints(data);
    }
    fetchPoints();
  }, []);

  const plotData = [
    {
      id: "humidade",
      data: points.reverse().map((p, i) => ({
        x: i,
        y: p.hum
      }))
    }
  ];

  return (
    <div style={{ height: 500 }}>
      <LinePlot
        data={plotData}
        colorScheme="dark2"
        yAxisMax="100"
        yAxisLabel="Umidade"
      />
    </div>
  );
}
