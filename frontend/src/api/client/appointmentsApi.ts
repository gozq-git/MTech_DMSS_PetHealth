import { BaseApiClient } from "./createApiClient.ts";
import { Appointment, AppointmentApiResponse } from "../types/appointments.ts";

export interface AppointmentsApi {
  markAvailability: (data: { vet_id: string; available_date: string }) => Promise<AppointmentApiResponse<any>>;
  getAvailableVets: (params: { query: { date: string } }) => Promise<AppointmentApiResponse<any>>;
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
  getPendingAppointmentsForVet: (params: { query: { date: string; vet_id?: string;} }) => Promise<AppointmentApiResponse<Appointment[]>>;
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
      const response = await baseClient.get<{ status: 'success' | 'error'; message: any }>('/api/appointments/availableVets', { params: params.query });
      return {
        success: response.status === 'success',
        data: response.message,
        message: response.status === 'success' ? 'Available vets retrieved successfully' : response.message,
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
    getPendingAppointmentsForVet: async (params) => {
      const response = await baseClient.get<{ status: 'success' | 'error'; message: any }>('/api/appointments/getPendingAppointments', { params: params.query });
      return {
        success: response.status === 'success',
        data: response.message,
        message: response.status === 'success' ? 'Pending appointments retrieved successfully' : response.message,
      };
    },
  };
};
