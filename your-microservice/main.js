// your-microservice/index.js

const client = require('./services/mqttService');
const { FREQUENCY_ENDPOINT, ALERTS_ENDPOINT, SLIDING_WINDOW_SECONDS, LOW_FREQUENCY_THRESHOLD } = require('./config/config');
const axios = require('axios');

// --- Data Storage ---
const deviceData = {}; // Store device-specific data, frequencies, and last status

// --- MQTT Connection Handlers ---
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('/dummylink/+/data/status');    // Subscribe to device status topics
  client.subscribe('/dummylink/+/data/frequency'); // Subscribe to device frequency topics
});

client.on('error', (error) => {
  console.error('MQTT Connection Error:', error);
});

// --- MQTT Message Handler ---
client.on('message', (topic, message) => {
  try {
    const topicParts = topic.split('/'); // Split the topic string by '/'
    const deviceId = topicParts[2];      // Extract deviceId from topic (e.g., 'device1')
    const dataType = topicParts[4];      // Extract data type from topic (e.g., 'frequency', 'status')

    // Initialize device data if not already present
    if (!deviceData[deviceId]) {
      deviceData[deviceId] = { frequencies: [], lastStatus: 'OK' };
    }

    if (dataType === 'frequency') {
      // Process frequency data
      const frequency = parseFloat(message.toString()); // Convert message to float
      deviceData[deviceId].frequencies.push({ value: frequency, timestamp: Date.now() }); // Store frequency and timestamp
      pruneOldData(deviceId); // Remove frequencies older than the sliding window
    } else if (dataType === 'status') {
      // Process status data
      const status = message.toString(); // Convert message to string
      handleStatusChange(deviceId, status); // Handle status change and alerts
      deviceData[deviceId].lastStatus = status; // Update last known status
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

// --- Helper Functions ---

// Remove frequency readings older than the sliding window
function pruneOldData(deviceId) {
  const cutoffTime = Date.now() - (SLIDING_WINDOW_SECONDS * 1000); // Calculate cutoff timestamp
  deviceData[deviceId].frequencies = deviceData[deviceId].frequencies.filter( // Filter frequencies array
    (entry) => entry.timestamp >= cutoffTime // Keep entries with timestamps within the window
  );
}

// Calculate the average frequency over the sliding window
function calculateAverageFrequency(deviceId) {
  const device = deviceData[deviceId];
  if (!device || device.frequencies.length === 0) {
    return { average: null, samples: 0 }; // Return null average if no data
  }

  let sum = 0;
  for (const entry of device.frequencies) {
    sum += entry.value; // Sum up frequency values
  }
  const average = sum / device.frequencies.length; // Calculate average
  return { average, samples: device.frequencies.length }; // Return average and sample count
}

// Post data to API endpoint and handle response status
async function postToApi(endpoint, data) {
  try {
    const response = await axios.post(endpoint, data, { // Send POST request to API
      headers: { 'Content-Type': 'application/json' }, // Set Content-Type header
    });
    if (response.status === 201) {
      console.log(`Successfully posted to ${endpoint}:`, data); // Log success for 201 status
    } else {
      console.warn(`Received unexpected status code ${response.status} from ${endpoint}`); // Warn for non-201 status
    }
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error.response ? error.response.data : error.message); // Log error details
  }
}

// Handle device status changes and trigger alerts
function handleStatusChange(deviceId, newStatus) {
  const previousStatus = deviceData[deviceId].lastStatus;

  if (newStatus === 'ERROR' && previousStatus !== 'ERROR') {
    postToApi(ALERTS_ENDPOINT, [{ status: 'error', deviceId }]); // Send 'error' alert
  } else if (newStatus === 'OK' && previousStatus === 'ERROR') {
    postToApi(ALERTS_ENDPOINT, [{ status: 'ok', deviceId }]);   // Send 'ok' alert (recovery from error)
  }
}

// --- Periodic Task (Run every second) ---
setInterval(() => {
  const frequencyDataPayload = []; // Array to hold frequency data for API payload

  for (const deviceId in deviceData) {
    const { average, samples } = calculateAverageFrequency(deviceId); // Get average frequency

    if (average !== null) { // Only process if there is frequency data
      frequencyDataPayload.push({ frequency: average, samples, deviceId }); // Add to payload

      // Check for low frequency and send alert if needed
      if (average < LOW_FREQUENCY_THRESHOLD && deviceData[deviceId].lastStatus !== 'low_freq') {
        postToApi(ALERTS_ENDPOINT, [{ status: 'low_freq', deviceId }]); // Send 'low_freq' alert
        deviceData[deviceId].lastStatus = 'low_freq'; // Update device status
      } else if (average >= LOW_FREQUENCY_THRESHOLD && deviceData[deviceId].lastStatus === 'low_freq') {
        postToApi(ALERTS_ENDPOINT, [{ status: 'ok', deviceId }]);     // Send 'ok' alert (frequency recovered)
        deviceData[deviceId].lastStatus = 'ok';       // Update device status
      }
    }
  }

  if (frequencyDataPayload.length > 0) {
    postToApi(FREQUENCY_ENDPOINT, frequencyDataPayload); // Send frequency data to API
  }
}, 1000); // Run every 1000 milliseconds (1 second)

// --- Graceful Shutdown ---
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  client.end(); // Close MQTT connection
  process.exit(0); // Exit the process
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  client.end(); // Close MQTT connection
  process.exit(0); // Exit the process
});