import { FeeStrategy } from './FeeStrategy';

export class WeekdayWeekendStrategy implements FeeStrategy {
  calculateFee(date: Date): number {
    const day = date.getDay(); // 0: Sunday, 6: Saturday
    return (day === 0 || day === 6) ? 150 : 100;
  }
}
