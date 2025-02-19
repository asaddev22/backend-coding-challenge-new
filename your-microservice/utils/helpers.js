const axios = require('axios');
const { SLIDING_WINDOW_SECONDS } = require('../config/config');

function pruneOldData(deviceId, deviceData) {
  const cutoffTime = Date.now() - (SLIDING_WINDOW_SECONDS * 1000);
  deviceData[deviceId].frequencies = deviceData[deviceId].frequencies.filter(
    (entry) => entry.timestamp >= cutoffTime
  );
}

function calculateAverageFrequency(deviceId, deviceData) {
  const device = deviceData[deviceId];
  if (!device || device.frequencies.length === 0) {
    return { average: null, samples: 0 };
  }

  let sum = 0;
  for (const entry of device.frequencies) {
    sum += entry.value;
  }
  const average = sum / device.frequencies.length;
  return { average, samples: device.frequencies.length };
}

async function postToApi(endpoint, data) {
  try {
    const response = await axios.post(endpoint, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 201) {
      console.log(`Successfully posted to ${endpoint}:`, data);
    } else {
      console.warn(`Received unexpected status code ${response.status} from ${endpoint}`);
    }
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error.response ? error.response.data : error.message);
  }
}

function handleStatusChange(deviceId, newStatus, deviceData) {
  const previousStatus = deviceData[deviceId].lastStatus;

  if (newStatus === 'ERROR' && previousStatus !== 'ERROR') {
    postToApi(ALERTS_ENDPOINT, [{ status: 'error', deviceId }]);
  } else if (newStatus === 'OK' && previousStatus === 'ERROR') {
    postToApi(ALERTS_ENDPOINT, [{ status: 'ok', deviceId }]);
  }
}

module.exports = {
  pruneOldData,
  calculateAverageFrequency,
  postToApi,
  handleStatusChange,
};
