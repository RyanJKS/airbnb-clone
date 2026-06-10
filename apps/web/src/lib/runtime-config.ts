const DEFAULT_API_BASE_URL = "http://localhost:8000";
const DEFAULT_WEBSOCKET_BASE_URL = "ws://localhost:8000";

export function getApiBaseUrl() {
  return process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_HOST ?? DEFAULT_API_BASE_URL;
}

export function getWebSocketBaseUrl() {
  return process.env.NEXT_PUBLIC_WS_URL ?? DEFAULT_WEBSOCKET_BASE_URL;
}
