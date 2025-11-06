const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

// HiveMQ Cloud connection info
const broker = 'mqtts://6db8e3ab3e1f49e996390fcd994f9a27.s1.eu.hivemq.cloud:8883';
const username = 'Darshu';
const password = 'DARSHANhmd1@'; // HiveMQ Cloud password

// Topic to subscribe
const topic = 'esp32/sensors';

// File path to save data
const filePath = path.join(__dirname, 'sensor_data.txt');

// Connect options
const options = {
  username,
  password,
  rejectUnauthorized: false // Skip SSL cert check for HiveMQ Cloud
};

// Connect to HiveMQ
const client = mqtt.connect(broker, options);

let lastSaveTime = 0; // Track last message save time

client.on('connect', () => {
  console.log('✅ Connected to HiveMQ Cloud');

  // Subscribe to topic
  client.subscribe(topic, (err) => {
    if (err) console.error('❌ Subscription error:', err);
    else console.log(`📡 Subscribed to topic: ${topic}`);
  });
});

client.on('message', (topic, message) => {
  const currentTime = Date.now();

  // Only log once every 5 minutes (300000 ms)
  if (currentTime - lastSaveTime >= 300000) {
    const data = message.toString();
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${topic}: ${data}\n`;

    console.log(`💾 Received message:\n${logEntry}`);

    // Append data to file
    fs.appendFile(filePath, logEntry, (err) => {
      if (err) console.error('❌ Error writing to file:', err);
      else console.log('✅ Data written to sensor_data.txt');
    });

    lastSaveTime = currentTime; // update timestamp
  } else {
    console.log('⏳ Ignoring message (within 5-minute window)');
  }
});

client.on('error', (err) => {
  console.error('⚠️ MQTT error:', err);
});
