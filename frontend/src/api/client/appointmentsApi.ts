import { BaseApiClient } from "./createApiClient.ts";
import { Appointment, AppointmentApiResponse } from "../types/appointments.ts";

export interface AppointmentsApi {
  markAvailability: (data: { vet_id: string; available_date: string }) => Promise<AppointmentApiResponse<any>>;
  getAvailableVets: (params: { query: { date: string } }) => Promise<AppointmentApiResponse<any>>;
  getAvailabilityForVet: (params: { query: { vet_id: string; } }) => Promise<AppointmentApiResponse<any>>;
  bookAppointment: (data: {
    user_id: string;
    vet_id: string;
    appointment_date: string;
    appointment_time?: string | null;
  }) => Promise<AppointmentApiResponse<Appointment>>;
  respondAppointment: (data: {
    appointment_id: string;
    status: "accepted" | "rejected";
    rejection_reason?: string;
  }) => Promise<AppointmentApiResponse<Appointment>>;
  getAppointmentsForVet: (params: { query: { date: string; vet_id?: string;} }) => Promise<AppointmentApiResponse<Appointment[]>>;
  getAppointmentsForUser: (params: { query: { user_id?: string;} }) => Promise<AppointmentApiResponse<Appointment[]>>;
}

export const createAppointmentsApiClient = (baseClient: BaseApiClient): AppointmentsApi => {
  return {
    markAvailability: async (data) => {
      const response = await baseClient.post<{ status: 'success' | 'error'; message: any }>('/api/appointments/markAvailability', data);
      return {
        success: response.status === 'success',
        data: response.message,
        message: response.status === 'success' ? 'Availability marked successfully' : response.message,
      };
    },

    getAvailableVets: async (params) => {
      const response = await baseClient.get<{ status: 'success' | 'error'; data?: any; message?: string }>(
        '/api/appointments/availableVets',
        { params: params.query }
      );
    
      return {
        success: response.status === 'success',
        data: response.data,  
        message: response.message || '',
      };
    },

    getAvailabilityForVet: async (data) => {
      const response = await baseClient.post<{ status: 'success' | 'error'; message: any }>('/api/appointments/getAvailabilityForVet', data);
      return {
        success: response.status === 'success',
        data: response.message,
        message: response.status === 'success' ? 'Availability marked successfully' : response.message,
      };
    },
    
    bookAppointment: async (data) => {
      const response = await baseClient.post<{ status: 'success' | 'error'; message: any }>('/api/appointments/bookAppointment', data);
      return {
        success: response.status === 'success',
        data: response.message,
        message: response.status === 'success' ? 'Appointment booked successfully' : response.message,
      };
    },

    respondAppointment: async (data) => {
      const response = await baseClient.post<{ status: 'success' | 'error'; message: any }>('/api/appointments/respondAppointment', data);
      return {
        success: response.status === 'success',
        data: response.message,
        message: response.status === 'success' ? 'Appointment updated successfully' : response.message,
      };
    },

    getAppointmentsForVet: async (params) => {
      const response = await baseClient.get<{ status: 'success' | 'error'; data: Appointment[]; message?: string }>(
        '/api/appointments/getAppointmentsForVet',
        { params: params.query }
      );
      return {
        success: response.status === 'success',
        data: response.data,
        message: response.status === 'success' ? 'Pending appointments retrieved successfully' : (response.message || ''),
      };
    },    

    getAppointmentsForUser: async (params) => {
      const response = await baseClient.get<{ status: 'success' | 'error'; data: Appointment[]; message?: string }>(
        '/api/appointments/getAppointmentsForUser',
        { params: params.query }
      );
      return {
        success: response.status === 'success',
        data: response.data,
        message: response.status === 'success' ? 'Pending appointments retrieved successfully' : (response.message || ''),
      };
    }
  };
};
