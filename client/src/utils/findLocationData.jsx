import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
})

const findLocationData = async() => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "give Temperature(in degree celcius), Humidity(in %), Rainfall(in mm), UV Index(low,medium,high) of city Tumakuru, karnataka",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          Temperature: { type: Type.STRING },
          Humidity: { type: Type.STRING },
          Rainfall: { type: Type.STRING },
          UVIdx: { type: Type.STRING },
        },
        required: ["Temperature", "Humidity", "Rainfall", "UVIdx"],
        propertyOrdering: ["Temperature", "Humidity", "Rainfall", "UVIdx"],
      },
    },
  });

  const text = response.text
  const json = JSON.parse(text)
  return json
}

export default findLocationData
