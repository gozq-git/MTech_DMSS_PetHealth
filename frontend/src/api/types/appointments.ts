// src/api/types/appointment.ts

export interface Appointment {
    id: string;
    user_id: string;
    vet_id: string;
    pet_id: string;
    pet_name: string;
    appointment_date: string;
    appointment_time?: string;
    status: 'pending' | 'accepted' | 'rejected';
    rejection_reason?: string | null;
  }
  
  export interface AppointmentApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
  }
  