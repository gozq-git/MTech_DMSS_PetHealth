// src/api/types/availability.ts

export interface Availability {
    id: string;
    vet_id: string;
    available_date: string; // Stored as YYYY-MM-DD
  }
  
  export interface AvailabilityApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
  }
  