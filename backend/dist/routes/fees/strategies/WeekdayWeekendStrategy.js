"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekdayWeekendStrategy = void 0;
class WeekdayWeekendStrategy {
    calculateFee(date) {
        const day = date.getDay(); // 0: Sunday, 6: Saturday
        return (day === 0 || day === 6) ? 150 : 100;
    }
}
exports.WeekdayWeekendStrategy = WeekdayWeekendStrategy;
