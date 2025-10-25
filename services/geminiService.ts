
import { GoogleGenAI, Type } from "@google/genai";
import type { Patient, AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    symptomSeverity: {
      type: Type.STRING,
      description: "An assessment of the symptom severity. Must be one of two values: 'Severe' or 'Not Severe'."
    },
    analysis: {
      type: Type.STRING,
      description: "A brief, easy-to-understand analysis of the symptoms provided. Do not diagnose."
    },
    doctorSuggestion: {
      type: Type.STRING,
      description: "The type of specialist or doctor the patient should consider seeing (e.g., General Practitioner, Cardiologist)."
    },
    suggestedAppointments: {
      type: Type.ARRAY,
      description: "An array of three suggested appointment slots. This should only be provided for 'Not Severe' cases.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Suggested date in 'Month Day, YYYY' format (e.g., 'July 28, 2024')." },
          time: { type: Type.STRING, description: "Suggested time in 'HH:MM AM/PM' format (e.g., '10:30 AM')." }
        },
        required: ["date", "time"]
      }
    },
    suggestedMedications: {
      type: Type.ARRAY,
      description: "An array of suggested over-the-counter medications. This should only be provided for 'Not Severe' cases.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the medication." },
          dosage: { type: Type.STRING, description: "Suggested dosage (e.g., '2 tablets every 4-6 hours')." }
        },
        required: ["name", "dosage"]
      }
    },
    urgentCareInstructions: {
        type: Type.STRING,
        description: "Urgent care instructions for the patient. This should only be provided for 'Severe' cases, and must recommend seeing a doctor within the hour and going to the nearest hospital."
    },
    disclaimer: {
      type: Type.STRING,
      description: "A standard medical disclaimer stating this is not medical advice and a doctor should be consulted."
    }
  },
  required: ['symptomSeverity', 'analysis', 'doctorSuggestion', 'disclaimer']
};


export const getHealthAnalysis = async (patientData: Patient, coordinates: GeolocationCoordinates | null): Promise<AnalysisResult> => {
  const { name, age, gender, symptoms } = patientData;

  const locationInfo = coordinates
    ? `The patient is at location: latitude ${coordinates.latitude}, longitude ${coordinates.longitude}.`
    : `The patient's location is not available.`;

  const prompt = `
    A patient has submitted their information.
    - Name: ${name}
    - Age: ${age}
    - Gender: ${gender}
    - Symptoms: "${symptoms}"
    - ${locationInfo}

    Your task is to act as a helpful AI health assistant. Based on the symptoms, provide a brief analysis and assess the symptom severity ('Severe' or 'Not Severe'). Do not give a medical diagnosis. The tone should be helpful and reassuring.

    - IF the symptomSeverity is 'Severe': Provide 'urgentCareInstructions' advising the patient to seek medical attention at the nearest hospital within the next hour. Do not provide 'suggestedAppointments' or 'suggestedMedications'.
    - IF the symptomSeverity is 'Not Severe': Provide a list of 'suggestedMedications' (over-the-counter) with dosages, and a list of three 'suggestedAppointments'. Do not provide 'urgentCareInstructions'.

    Always provide an 'analysis', 'doctorSuggestion', and 'disclaimer'.
    Ensure the output is a valid JSON object matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    // Basic validation to ensure the result matches the expected structure
    if (
        typeof result.symptomSeverity !== 'string' ||
        !['Severe', 'Not Severe'].includes(result.symptomSeverity) ||
        typeof result.analysis !== 'string' ||
        typeof result.doctorSuggestion !== 'string' ||
        typeof result.disclaimer !== 'string'
    ) {
        throw new Error("Received malformed or incomplete data from AI model.");
    }
    
    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get health analysis from AI model.");
  }
};