export function turnPumpOnFor(s, callback) {
  window.backend.TurnPump("on");
  setTimeout(() => {
    callback();
  }, 1000 * s);
}

export function turnPump(s) {
  return window.backend.TurnPump(s);
}
