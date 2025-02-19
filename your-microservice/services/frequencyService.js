const { postToApi, pruneOldData, calculateAverageFrequency } = require('../utils/helpers');
const { FREQUENCY_ENDPOINT, LOW_FREQUENCY_THRESHOLD, ALERTS_ENDPOINT } = require('../config/config');

const deviceData = {};

function handleFrequencyMessage(deviceId, frequency) {
  if (!deviceData[deviceId]) {
    deviceData[deviceId] = { frequencies: [], lastStatus: 'OK' };
  }

  deviceData[deviceId].frequencies.push({ value: frequency, timestamp: Date.now() });
  pruneOldData(deviceId, deviceData);
}

function processFrequencyData() {
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
}

setInterval(processFrequencyData, 1000);

module.exports = { handleFrequencyMessage };
