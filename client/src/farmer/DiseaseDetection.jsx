import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios'

const DiseaseDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

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
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/predict',
        formData
      );
    
      if (!response.status===200) {
        throw new Error('Failed to get prediction');
      }

      setResult(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred while processing the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
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
            <div className="mt-6 bg-green-100 border border-green-600 rounded-xl p-6">
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
                  <span className="text-green-600 font-bold text-lg">
                    {(result.confidence * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence * 100}%` }}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;