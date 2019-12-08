const LIMIT = 50;

export async function getCurrentHumidity() {
  const point = await window.backend.getCurrentTempHum();
  return point.Hum;
}

export async function getHumPoints() {
  const points = await window.backend.GetPoints(LIMIT);
  return points.map(p => ({ hum: p.Hum, timestamp: p.Timestamp }));
}
