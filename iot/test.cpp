#include <WiFi.h>
#include <PubSubClient.h>
#include <HardwareSerial.h>
#include <WiFiClientSecure.h>
#include "DHT.h"

// ==== PIN CONFIGURATION ====
#define DHTPIN 25
#define DHTTYPE DHT11
#define MOISTURE_PIN 34

DHT dht(DHTPIN, DHTTYPE);
HardwareSerial mod(2); // RX2=16, TX2=17 for NPK

// ==== WIFI & MQTT CONFIG ====
const char* ssid = "v";
const char* password = "12345678";
const char* mqtt_server = "6db8e3ab3e1f49e996390fcd994f9a27.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "Darshu";
const char* mqtt_pass = "DARSHANhmd1@";

WiFiClientSecure espClient;
PubSubClient client(espClient);

// ==== WIFI SETUP ====
void setupWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  espClient.setInsecure(); // Ignore SSL certificate validation
  client.setServer(mqtt_server, mqtt_port);
}

// ==== NPK FUNCTIONS ====
void modbusWrite(uint8_t* frame, uint8_t len) {
  mod.write(frame, len);
  mod.flush();
}

int readNPK(int *N, int *P, int *K, float *temp, float *moisture) {
  uint8_t query[] = {0x01, 0x03, 0x00, 0x00, 0x00, 0x07, 0x04, 0x08};
  modbusWrite(query, 8);
  delay(200);

  uint8_t resp[25];
  int len = mod.readBytes(resp, 25);
  if (len < 15) return 0;

  *temp = (resp[3] << 8 | resp[4]) / 10.0;
  *moisture = (resp[5] << 8 | resp[6]) / 10.0;
  *N = resp[9];
  *P = resp[11];
  *K = resp[13];
  return 1;
}

// ==== SEND TO HIVEMQ ====
void sendToHiveMQ(float npk_temp, float npk_moist, int N, int P, int K,
                  float airTemp, float airHum, int soilADC, float soilPercent) {
  char payload[256];
  snprintf(payload, sizeof(payload),
           "{\"N\":%d,\"P\":%d,\"K\":%d,"
           "\"SoilTemp\":%.1f,\"SoilMoist\":%.1f,"
           "\"AirTemp\":%.1f,\"AirHum\":%.1f,"
           "\"SoilADC\":%d,\"SoilMoisturePct\":%.1f}",
           N, P, K, npk_temp, npk_moist, airTemp, airHum, soilADC, soilPercent);

  client.publish("esp32/sensors", payload);
  Serial.println("✅ Data sent to HiveMQ:");
  Serial.println(payload);
}

// ==== SETUP ====
void setup() {
  Serial.begin(115200);
  mod.begin(9600, SERIAL_8N1, 16, 17);
  dht.begin();
  setupWiFi();
  Serial.println("ESP32 Sensor Node Ready (DHT11 + Moisture + NPK)");
}

// ==== MAIN LOOP ====
void loop() {
  if (!client.connected()) {
    Serial.println("Connecting to HiveMQ...");
    if (client.connect("ESP32_Client", mqtt_user, mqtt_pass)) {
      Serial.println("✅ Connected to HiveMQ!");
    } else {
      Serial.println("❌ HiveMQ connection failed, retrying...");
      delay(3000);
      return;
    }
  }

  // Step 1: DHT11
  float airTemp = dht.readTemperature();
  float airHum = dht.readHumidity();

  // Step 2: Moisture
  int soilADC = analogRead(MOISTURE_PIN);
  float soilPercent = map(soilADC, 4095, 0, 0, 100);

  // Step 3: NPK
  int N = 0, P = 0, K = 0;
  float npk_temp = 0, npk_moist = 0;

  Serial.println("\n------ SENSOR READINGS ------");
  Serial.print("Air Temperature: "); Serial.print(airTemp); Serial.println(" °C");
  Serial.print("Air Humidity: "); Serial.print(airHum); Serial.println(" %");
  Serial.print("Soil Moisture (Analog %): "); Serial.println(soilPercent);

  if (readNPK(&N, &P, &K, &npk_temp, &npk_moist)) {
    Serial.print("N: "); Serial.println(N);
    Serial.print("P: "); Serial.println(P);
    Serial.print("K: "); Serial.println(K);
    Serial.print("NPK Temp: "); Serial.println(npk_temp);
    Serial.print("NPK Moisture: "); Serial.println(npk_moist);

    sendToHiveMQ(npk_temp, npk_moist, N, P, K, airTemp, airHum, soilADC, soilPercent);
  } else {
    Serial.println("⚠️ Failed to read NPK sensor");
  }

  Serial.println("------------------------------\n");

  client.loop();

  Serial.println("⏳ Waiting 4 minutes before next reading...");
  delay(240000); // 4 minutes delay (240000 ms)
}
