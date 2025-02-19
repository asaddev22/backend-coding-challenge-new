const { postToApi, pruneOldData, calculateAverageFrequency, handleStatusChange } = require('./helpers');
const { FREQUENCY_ENDPOINT, ALERTS_ENDPOINT, LOW_FREQUENCY_THRESHOLD } = require('../config/config');
const { handleFrequencyMessage } = require('../services/frequencyService');
const { handleStatusMessage } = require('../services/alertService');

const deviceData = {};

function handleMessage(topic, message) {
  try {
    const topicParts = topic.split('/');
    const deviceId = topicParts[2];
    const dataType = topicParts[4];

    if (dataType === 'frequency') {
      const frequency = parseFloat(message.toString());
      handleFrequencyMessage(deviceId, frequency);
    } else if (dataType === 'status') {
      const status = message.toString();
      handleStatusMessage(deviceId, status);
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
}

setInterval(() => {
  const frequencyDataPayload = [];

  for (const deviceId in deviceData) {
    const { average, samples } = calculateAverageFrequency(deviceId, deviceData);

    if (average !== null) {
      frequencyDataPayload.push({ frequency: average, samples, deviceId });

      if (average < LOW_FREQUENCY_THRESHOLD && deviceData[deviceId].lastStatus !== 'low_freq') {
        postToApi(ALERTS_ENDPOINT, [{ status: 'low_freq', deviceId }]);
        deviceData[deviceId].lastStatus = 'low_freq';
      } else if (average >= LOW_FREQUENCY_THRESHOLD && deviceData[deviceId].lastStatus === 'low_freq') {
        postToApi(ALERTS_ENDPOINT, [{ status: 'ok', deviceId }]);
        deviceData[deviceId].lastStatus = 'ok';
      }
    }
  }

  if (frequencyDataPayload.length > 0) {
    postToApi(FREQUENCY_ENDPOINT, frequencyDataPayload);
  }
}, 1000);

module.exports = { handleMessage };
