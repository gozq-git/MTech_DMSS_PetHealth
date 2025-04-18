export interface FeeStrategy {
    calculateFee(date: Date): number;
  }
  