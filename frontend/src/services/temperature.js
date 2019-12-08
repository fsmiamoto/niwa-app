const LIMIT = 50;

export async function getCurrentTemperature() {
  const point = await window.backend.getCurrentTempHum();
  return point.Temp;
}

export async function getTempPoints() {
  const points = await window.backend.GetPoints(LIMIT);
  return points.map(p => ({ temp: p.Temp.toFixed(3), timestamp: p.Timestamp }));
}
