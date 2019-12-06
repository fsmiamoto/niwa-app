export async function getCurrentHumidity() {
  const [, hum] = await window.backend.getCurrentTempHum();
  return hum;
}
