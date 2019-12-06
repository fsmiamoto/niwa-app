export async function getCurrentTemperature() {
  const [temp] = await window.backend.getCurrentTempHum();
  return temp;
}
