
import React, { useState, FormEvent } from 'react';
import type { Patient } from '../types';

interface PatientFormProps {
  onSubmit: (patientData: Patient) => void;
  isLoading: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [symptoms, setSymptoms] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      newErrors.age = 'Please enter a valid age.';
    }
    if (!symptoms.trim() || symptoms.trim().length < 10) {
      newErrors.symptoms = 'Please describe your symptoms in at least 10 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name,
        age: parseInt(age, 10),
        gender,
        symptoms,
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary">Patient Information</h2>
        <p className="text-gray-500 mt-1">Please fill out your details for an AI-powered health analysis.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
                  required
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">Describe Symptoms</label>
          <textarea
            id="symptoms"
            rows={5}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${errors.symptoms ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
            placeholder="e.g., persistent headache, fatigue, and slight fever for the last 2 days..."
            required
          />
          {errors.symptoms && <p className="text-red-500 text-xs mt-1">{errors.symptoms}</p>}
        </div>
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Get AI Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
