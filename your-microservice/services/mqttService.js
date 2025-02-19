const mqtt = require('mqtt');
const { MQTT_BROKER } = require('../config/config');
const { handleMessage } = require('../utils/messageHandler');

const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('/dummylink/+/data/status');
  client.subscribe('/dummylink/+/data/frequency');
});

client.on('error', (error) => {
  console.error('MQTT Connection Error:', error);
});

client.on('message', (topic, message) => {
  handleMessage(topic, message);
});

module.exports = client;
