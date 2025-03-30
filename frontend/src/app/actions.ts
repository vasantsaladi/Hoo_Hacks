'use server'

import { revalidatePath } from 'next/cache'

interface FormData {
  businessType: string;
  inventorySize: number;
  perishableItems: number;
  averageOrderSize: number;
  storageCapacity: number;
  currentWastePercentage: number;
  businessSize: string;
  location: string;
}

export interface Prediction {
  wasteAmount: number;
  savingsPotential: number;
  recommendations: string[];
}

interface ActionState {
  success: boolean;
  error?: string;
  predictions?: Prediction;
}

export async function saveFormData(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  try {
    // Here you would call your ML model or prediction service
    // For now, we'll simulate a prediction
    const predictions: Prediction = {
      wasteAmount: formData.perishableItems * (formData.currentWastePercentage / 100),
      savingsPotential: formData.perishableItems * (formData.currentWastePercentage / 100) * 5, // $5 per item
      recommendations: [
        "Reduce order of perishables by 10%",
        "Promote items nearing expiration",
        `Optimize ${formData.businessType} inventory levels`
      ]
    }
    
    revalidatePath('/')
    
    return { 
      success: true,
      predictions 
    }
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to generate predictions' 
    }
  }
}

export async function autoSaveFormData(formData: FormData): Promise<ActionState> {
  try {
    // Simulate auto-save delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Here you would save to a temporary storage or database
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Auto-save failed' }
  }
} 