
import React, { useState, useCallback } from 'react';
import { Patient, AnalysisResult } from './types';
import { getHealthAnalysis } from './services/geminiService';
import PatientForm from './components/PatientForm';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import AnalysisDisplay from './components/AnalysisDisplay';

const App: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (patientData: Patient) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setPatient(patientData);

    const performAnalysis = async (coordinates: GeolocationCoordinates | null) => {
      try {
        const result = await getHealthAnalysis(patientData, coordinates);
        setAnalysisResult(result);
      } catch (err) {
        console.error(err);
        setError('An error occurred while analyzing the symptoms. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          performAnalysis(position.coords);
        },
        (err) => {
          console.warn(`Geolocation error (${err.code}): ${err.message}`);
          // If user denies location, proceed without it
          performAnalysis(null);
        },
        { timeout: 10000 }
      );
    } else {
      // Geolocation not supported by the browser
      performAnalysis(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    setPatient(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {!analysisResult && !isLoading && <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />}

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
              <LoadingSpinner />
              <p className="mt-4 text-lg font-medium text-primary">Analyzing symptoms, please wait...</p>
              <p className="text-gray-500 mt-2">Our AI is preparing your health insights.</p>
            </div>
          )}

          {error && (
            <div className="p-8 bg-white rounded-xl shadow-lg border border-red-200 text-center">
              <h2 className="text-xl font-bold text-red-600">Error</h2>
              <p className="text-red-500 mt-2">{error}</p>
              <button
                onClick={handleReset}
                className="mt-6 bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {analysisResult && patient && !isLoading && (
            <AnalysisDisplay result={analysisResult} patient={patient} onReset={handleReset} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;