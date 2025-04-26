"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOfDayStrategy = void 0;
class TimeOfDayStrategy {
    calculateFee(date) {
        const hour = date.getHours();
        return hour >= 19 ? 50 : 20; // after 7 PM = evening charge
    }
}
exports.TimeOfDayStrategy = TimeOfDayStrategy;
