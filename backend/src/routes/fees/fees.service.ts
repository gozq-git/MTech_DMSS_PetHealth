import { format } from 'date-fns';

// Strategy imports
import { WeekdayWeekendStrategy } from './strategies/WeekdayWeekendStrategy';
import { TimeOfDayStrategy } from './strategies/TimeOfDayStrategy';

const FeesService = {
  calculateTotalFee: (date: Date) => {
    const weekdayWeekendStrategy = new WeekdayWeekendStrategy();
    const timeOfDayStrategy = new TimeOfDayStrategy();

    const baseFee = weekdayWeekendStrategy.calculateFee(date);
    const timeFee = timeOfDayStrategy.calculateFee(date);

    const total = baseFee + timeFee;

    return {
      date: format(date, 'yyyy-MM-dd'),
      time: format(date, 'HH:mm:ss'),
      baseFee,
      timeFee,
      total,
    };
  }
};

export default FeesService;
