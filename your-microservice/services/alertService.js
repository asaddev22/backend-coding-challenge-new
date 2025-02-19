const { postToApi } = require('../utils/helpers');
const { ALERTS_ENDPOINT } = require('../config/config');

const deviceData = {};

function handleStatusMessage(deviceId, status) {
  if (!deviceData[deviceId]) {
    deviceData[deviceId] = { frequencies: [], lastStatus: 'OK' };
  }

  const previousStatus = deviceData[deviceId].lastStatus;

  if (status === 'ERROR' && previousStatus !== 'ERROR') {
    postToApi(ALERTS_ENDPOINT, [{ status: 'error', deviceId }]);
  } else if (status === 'OK' && previousStatus === 'ERROR') {
    postToApi(ALERTS_ENDPOINT, [{ status: 'ok', deviceId }]);
  }

  deviceData[deviceId].lastStatus = status;
}

module.exports = { handleStatusMessage };
