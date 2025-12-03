const fs = require("fs");
const path = require("path");

exports.getSensorData = (req, res) => {
  const filePath = path.join(__dirname, "..", "..", "iot", "sensor_data.txt");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading sensor data" });
    }

    // Split lines & filter out empty ones
    const lines = data.trim().split("\n").filter(line => line.length > 0);

    // Get the latest line
    const latestLine = lines[lines.length - 1];

    // Example format:
    // [2025-11-07T06:54:17.952Z] esp32/sensors: {"N":3,"P":0,...}

    // Extract datetime + JSON part
    const dateTimeMatch = latestLine.match(/\[(.*?)\]/);
    const jsonMatch = latestLine.match(/\{.*\}/);

    if (!dateTimeMatch || !jsonMatch) {
      return res.status(500).json({ error: "Invalid sensor data format" });
    }

    const dateTime = new Date(dateTimeMatch[1]);
    const parsedJson = JSON.parse(jsonMatch[0]);

    // Final structured output
    const responseData = {
      date: dateTime.toISOString().split("T")[0],
      time: dateTime.toISOString().split("T")[1].replace("Z", ""),
      ...parsedJson,
    };

    res.json(responseData);
  });
};
