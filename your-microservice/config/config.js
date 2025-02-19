const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

module.exports = {
  MQTT_BROKER,
  API_BASE_URL,
  FREQUENCY_ENDPOINT: `${API_BASE_URL}/frequency`,
  ALERTS_ENDPOINT: `${API_BASE_URL}/alerts`,
  SLIDING_WINDOW_SECONDS: 60,
  LOW_FREQUENCY_THRESHOLD: 49,
};
