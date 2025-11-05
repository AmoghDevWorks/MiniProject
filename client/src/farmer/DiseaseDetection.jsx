import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios'
import { useSelector } from 'react-redux'

const DiseaseDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [RAGData,setRAGData] = useState(null);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  const IsIoTAvailable = useSelector((state=>state.user?.IoTDeviceId))
  const farmerId = useSelector((state=>state.user?._id))

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setShowOptions(false);
      setResult(null);
      setError(null);
    }
  };

  const handleUploadClick = () => {
    setShowOptions(!showOptions);
  };

  const handleCameraClick = () => {
    cameraInputRef.current.click();
  };

  const handleSystemClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setRAGData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setRAGData(null);

    try {
      // 1️⃣ Step 1: Send image to prediction API
      const formData = new FormData();
      formData.append('file', image);

      const predictionResponse = await axios.post(
        'http://127.0.0.1:5000/api/predict',
        formData
      );

      if (predictionResponse.status !== 200) {
        throw new Error('Failed to get prediction');
      }

      const resultData = predictionResponse.data;
      setResult(resultData);

      // 2️⃣ Step 2: Retrieve IoT data (or mock if not connected)
      const sensorData = {
        temperature: 28.5, // example value
        moisture: 65,      // example value
        npk: "12-8-10"     // example value
      };

      const DetectionQuery = `The result of the model regarding the uploaded image is label: ${resultData.label} with a confidence of ${(resultData.confidence * 100).toFixed(2)}%.`;

      const IoTQuery = IsIoTAvailable
        ? `
          The response of the IoT sensors are:
          1. Temperature: ${sensorData.temperature} °C
          2. Moisture: ${sensorData.moisture} %
          3. NPK: ${sensorData.npk}
        `
        : "IoT sensor data is not available.";

      const jsonForQuery = {
        query: `${DetectionQuery}\n${IoTQuery}`
      };

      // 3️⃣ Step 3: Send data to RAG retrieval API
      const ragResponse = await axios.post(
        'http://127.0.0.1:5000/rag/retrieval',
        jsonForQuery
      );

      if (ragResponse.status !== 200) {
        throw new Error('Failed to get RAG retrieval response');
      }

      const ragData = ragResponse.data.response;
      // console.log(ragData)
      setRAGData(ragData);

      // 4️⃣ Step 4: Save detection data in your database
      const saveData = {
        farmerId, // must be available from your state or auth
        result: resultData.label,
        confidence: resultData.confidence,
        notes: ragData.notes,
        recommendation: ragData.recommendations
      };

      const saveResponse = await axios.post(
        'http://localhost:8000/farmer/saveDetectionData',
        saveData
      );

      if (saveResponse.status !== 200) {
        throw new Error('Failed to save detection data');
      }

      console.log("✅ Detection data saved successfully:", saveResponse.data);

    } catch (err) {
      setError(err.message || 'An error occurred during prediction or retrieval');
      console.error("❌ Error in handlePredict:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // color helper: pick fixed colors by confidence bands for clearer intensity differences
  const getProgressColor = (label, confidence) => {
    const lab = (label || '').toString().toLowerCase();
    const isHealthy = lab.includes('healthy') || lab.includes('no disease') || lab === 'healthy';
    const c = Math.max(0, Math.min(1, confidence ?? 0)) * 100; // 0..100

    if (isHealthy) {
      if (c >= 90) return '#145A32'; // dark green
      if (c >= 80) return '#2E7D32'; // medium green
      if (c >= 70) return '#66BB6A'; // light green
      return '#DFF7E6';             // very light green / neutral
    } else {
      if (c >= 90) return '#7F0000'; // very dark red
      if (c >= 80) return '#FF5722'; // orange-ish for high-but-not-max disease confidence
      if (c >= 70) return '#F39C12'; // amber / less intense
      return '#F8D7DA';             // pale red / muted
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-white/10">
          <div className="p-6 rounded-2xl bg-white/30 border border-white/40 shadow-lg backdrop-blur-xl flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-green-700 animate-spin mb-3" />
            <p className="text-green-900 font-medium tracking-wide lowercase">
              loading
            </p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Disease Detection
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Upload an image to detect diseases
          </p>

          {/* Upload Section */}
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />

            {!preview ? (
              <div className="relative">
                <button
                  onClick={handleUploadClick}
                  className="w-full py-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-600 hover:bg-green-100 transition-all duration-200 flex flex-col items-center justify-center gap-3"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <span className="text-gray-600 font-medium">
                    Click to upload image
                  </span>
                </button>

                {showOptions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                    <button
                      onClick={handleCameraClick}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-green-100 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Take Photo</span>
                    </button>
                    <button
                      onClick={handleSystemClick}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-green-100 transition-colors border-t border-gray-200"
                    >
                      <Upload className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Choose from System</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Predict Button */}
          {preview && !result && (
            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Detect Disease'
              )}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className={`mt-6 ${result.label == 'Disease' ? 'bg-red-100' : 'bg-green-100'} border ${result.label == 'Disease' ?"border-red-600" : "border-green-600" } rounded-xl p-6`}>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Detection Results
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Disease:</span>
                  <span className="text-gray-900 font-bold text-lg">
                    {result.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Confidence:</span>
                  <span className={`${result.label == 'Disease' ? 'text-red-900' : 'text-green-900'} font-bold text-lg`}>
                    {(result.confidence * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${result.confidence * 100}%`,
                        background: getProgressColor(result.label, result.confidence)
                      }}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleRemoveImage}
                className="mt-6 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Analyze Another Image
              </button>
              {RAGData &&
                <div className={`mt-10 border-2 ${result.label == 'Disease' ?"border-red-500" : "border-green-500" } p-4 rounded-md`}>
                  <h1 className='text-center text-3xl mb-2 font-bold underline underline-offset-2'>Expertise Analysis</h1>
                  <p className='text-'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{RAGData.notes}</p>
                  <div>
                    <h2 className="text-2xl mt-8 mb-2 font-semibold text-black-300">
                      Recommendations
                    </h2>

                    <ul className="space-y-3">
                      {RAGData.recommendations && RAGData.recommendations.length > 0 ? (
                        RAGData.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className={`p-4 border ${result.label == 'Disease' ?"border-red-600" : "border-green-600" } rounded-lg transition`}
                          >
                            <p className="font-semibold text-lg">
                              • <span className="text-black underline underline-offset-2 text-xl">Action</span>: {rec.action}
                            </p>
                            {rec.reason && (
                              <p className="text-slate-900 ml-4">
                                <span className="text-slate-950 text-lg">Reason:</span> {rec.reason}
                              </p>
                            )}
                          </li>
                        ))
                      ) : (
                        <p className="text-slate-800 italic">No recommendations available.</p>
                      )}
                    </ul>
                  </div>
                </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;