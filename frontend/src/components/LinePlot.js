import React from "react";
import { ResponsiveLine } from "@nivo/line";

export function LinePlot(props) {
  const { data, yAxisLabel, xAxisLabel, yAxisMax, colorScheme } = props;

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 30, right: 50, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        stacked: true,
        min: 0,
        max: yAxisMax ? yAxisMax : "auto"
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: xAxisLabel,
        legendOffset: 36,
        legendPosition: "middle"
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxisLabel,
        legendOffset: -40,
        legendPosition: "middle"
      }}
      colors={{ scheme: colorScheme ? colorScheme : "nivo" }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
    />
  );
}
