const mqtt = require('mqtt');

// HiveMQ Cloud connection info
const broker = 'mqtts://6db8e3ab3e1f49e996390fcd994f9a27.s1.eu.hivemq.cloud:8883';
const username = '';
const password = ''; // HiveMQ Cloud password

// Topic to subscribe
const topic = 'test/topic';

// Connect options
const options = {
    username: username,
    password: password,
    rejectUnauthorized: false // set to true if you have CA certificate
};

// Connect to HiveMQ Cloud
const client = mqtt.connect(broker, options);

client.on('connect', () => {
    console.log('Connected to HiveMQ Cloud');

    // Subscribe to the topic
    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Subscription error:', err);
        } else {
            console.log(`Subscribed to topic: ${topic}`);
        }
    });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);
});

// Handle errors
client.on('error', (err) => {
    console.error('MQTT error:', err);
});
