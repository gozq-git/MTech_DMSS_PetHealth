import { FeeStrategy } from './FeeStrategy';

export class TimeOfDayStrategy implements FeeStrategy {
  calculateFee(date: Date): number {
    const hour = date.getHours();
    return hour >= 19 ? 50 : 20; // after 7 PM = evening charge
  }
}
