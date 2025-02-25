import React, { useState } from 'react';
import { Upload, FileUp, Activity, AlertCircle, CheckCircle2, X, Stethoscope, FileImage, FileText, Brain, Shield } from 'lucide-react';

interface PredictionResult {
  probability: number;
  prediction: 'Positive' | 'Negative';
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'blood' | 'mri'>('blood');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType);

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process the file');
      }

      const data = await response.json();
      setResult({
        probability: data.probability,
        prediction: data.prediction
      });
    } catch (err) {
      setError("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="w-12 h-12 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-red-800">
              AI Cancer Detection System
            </h1>
          </div>
          <p className="text-red-600 max-w-2xl mx-auto">
            Advanced medical imaging analysis powered by artificial intelligence for early cancer detection
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* File Type Selection */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setFileType('blood')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  fileType === 'blood'
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Blood Test Report</span>
              </button>
              <button
                onClick={() => setFileType('mri')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  fileType === 'mri'
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span>MRI Scan</span>
              </button>
            </div>

            {/* Upload Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-red-200 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept={fileType === 'blood' ? ".csv,.xlsx,.xls" : ".dcm,.jpg,.jpeg,.png"}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <Upload className="w-12 h-12 text-red-500" />
                  <div className="text-lg font-medium text-red-800">
                    {file ? file.name : fileType === 'blood' ? "Upload Blood Test Data" : "Upload MRI Scan"}
                  </div>
                  <p className="text-sm text-red-500">
                    {fileType === 'blood' 
                      ? "Accepted formats: CSV, Excel" 
                      : "Accepted formats: DICOM, JPG, PNG"}
                  </p>
                </label>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium 
                  ${loading 
                    ? 'bg-red-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 transform hover:scale-[1.02] transition-all'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Activity className="animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FileUp />
                    <span>Analyze {fileType === 'blood' ? 'Blood Test' : 'MRI Scan'}</span>
                  </div>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                <AlertCircle className="shrink-0" />
                <p>{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                <div className="flex items-center space-x-4 mb-4">
                  <CheckCircle2 className={`w-8 h-8 ${
                    result.prediction === 'Negative' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <h3 className="text-xl font-semibold text-red-800">
                    Analysis Complete
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-red-700">Prediction:</span>
                    <span className={`font-bold ${
                      result.prediction === 'Negative' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.prediction}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-red-700">Confidence:</span>
                    <span className="font-bold text-red-800">
                      {(result.probability * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-red-600" />
                AI Technology
              </h3>
              <p className="text-red-600">
                Our system leverages advanced machine learning algorithms to analyze medical data
                and detect potential cancer markers with high accuracy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <FileImage className="w-5 h-5 mr-2 text-red-600" />
                Supported Formats
              </h3>
              <p className="text-red-600">
                We support various medical file formats including DICOM for MRI scans,
                and CSV/Excel for blood test results.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Data Security
              </h3>
              <p className="text-red-600">
                Your medical data is processed with the highest level of security and privacy,
                following HIPAA compliance guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;