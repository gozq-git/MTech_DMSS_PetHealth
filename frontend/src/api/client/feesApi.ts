import { BaseApiClient } from "./createApiClient.ts";

export interface FeesApi {
  getConsultationFee: () => Promise<{
    status: 'success' | 'error';
    message: string;
    data: {
      date: string;
      time: string;
      baseFee: number;
      timeFee: number;
      total: number;
    };
  }>;
}

export const createFeesApiClient = (baseClient: BaseApiClient): FeesApi => {
  return {
    getConsultationFee: async () => {
      const response = await baseClient.get<{
        status: 'success' | 'error';
        date: string;
        time: string;
        baseFee: number;
        timeFee: number;
        total: number;
        message: string;
      }>('/api/fees/consultation-fee');

      return {
        status: response.status,
        message: response.message,
        data: {
          date: response.date,
          time: response.time,
          baseFee: response.baseFee,
          timeFee: response.timeFee,
          total: response.total,
        },
      };
    },
  };
};
