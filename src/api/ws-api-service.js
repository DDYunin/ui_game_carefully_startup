export const socket = new WebSocket("ws://80.78.243.125/:11864/api/websocket/trade-updates");
// export const socket = new WebSocket("ws://localhost:11864/api/websocket/trade-updates");

socket.onopen = function(e) {
  console.log("[open] Соединение установлено");
  console.log("Отправляем данные на сервер");
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
  } else {
    // например, сервер убил процесс или сеть недоступна
    // обычно в этом случае event.code 1006
    console.log('[close] Соединение прервано');
  }
};

socket.onerror = function(error) {
  console.log(`[error]`);
};