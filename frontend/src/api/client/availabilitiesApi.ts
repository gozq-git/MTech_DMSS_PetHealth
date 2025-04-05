import { BaseApiClient } from "./createApiClient.ts";
import { Availability, AvailabilityApiResponse } from "../types/availabilities.ts";

export interface AvailabilitiesApi {
  markAvailability: (data: { vet_id: string; available_date: string }) => Promise<AvailabilityApiResponse<any>>;
  getAvailableVets: (params: { query: { date: string } }) => Promise<AvailabilityApiResponse<any>>;
  getAvailabilityForVet: (params: { query: { vet_id: string } }) => Promise<AvailabilityApiResponse<Availability[]>>;
}

export const createAvailabilitiesApiClient = (baseClient: BaseApiClient): AvailabilitiesApi => {
  return {
    markAvailability: async (data) => {
      const response = await baseClient.post<{ status: 'success' | 'error'; message: any }>('/api/availabilities/markAvailability', data);
      return {
        success: response.status === 'success',
        data: response.message,
        message: response.status === 'success' ? 'Availability marked successfully' : response.message,
      };
      console.log("markAvailability response", response);
    },

    getAvailableVets: async (params) => {
      const response = await baseClient.get<{ status: 'success' | 'error'; data?: any; message?: string }>(
        '/api/availabilities/getAvailableVets',
        { params: params.query }
      );
    
      return {
        success: response.status === 'success',
        data: response.data,  
        message: response.message || '',
      };
    },

    getAvailabilityForVet: async (params) => {
      const response = await baseClient.get<{ status: 'success' | 'error'; data?: Availability[]; message?: string }>(
        '/api/availabilities/getAvailabilityForVet',
        { params: params.query }
      );
    
      return {
        success: response.status === 'success',
        data: response.data || null,
        message: response.message || '',
      };
    }
};
}
