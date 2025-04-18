import FeesService from './fees.service';
import {toZonedTime } from 'date-fns-tz';

const FeesController = {
  getConsultationFee: async () => {
    try {
      const singaporeTimezone = 'Asia/Singapore';
      const nowUTC = new Date();
      const nowSG = toZonedTime(nowUTC, singaporeTimezone);
      const result = FeesService.calculateTotalFee(nowSG);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Error calculating consultation fee');
    }
  },
};

export default FeesController;
