export interface Patient {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  symptoms: string;
}

export interface Appointment {
  date: string;
  time: string;
}

export interface Medication {
  name: string;
  dosage: string;
}

export interface AnalysisResult {
  symptomSeverity: 'Severe' | 'Not Severe';
  analysis: string;
  doctorSuggestion: string;
  suggestedAppointments?: Appointment[];
  suggestedMedications?: Medication[];
  urgentCareInstructions?: string;
  disclaimer: string;
}
