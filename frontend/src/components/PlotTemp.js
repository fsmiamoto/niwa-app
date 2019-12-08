import React, { useEffect, useState } from "react";
import { getTempPoints } from "../services/temperature";
import { LinePlot } from "./LinePlot";

export function PlotTemp() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    async function fetchPoints() {
      const data = await getTempPoints();
      setPoints(data);
    }
    fetchPoints();
  }, []);

  const plotData = [
    {
      id: "temperatura",
      data: points.reverse().map((p, i) => ({
        x: i,
        y: p.temp
      }))
    }
  ];

  return (
    <div style={{ height: 500 }}>
      <LinePlot
        data={plotData}
        colorScheme="red_blue"
        yAxisMax="40"
        yAxisLabel="Temperatura"
        xFormat=""
      />
    </div>
  );
}
