"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
// Strategy imports
const WeekdayWeekendStrategy_1 = require("./strategies/WeekdayWeekendStrategy");
const TimeOfDayStrategy_1 = require("./strategies/TimeOfDayStrategy");
const FeesService = {
    calculateTotalFee: (date) => {
        const weekdayWeekendStrategy = new WeekdayWeekendStrategy_1.WeekdayWeekendStrategy();
        const timeOfDayStrategy = new TimeOfDayStrategy_1.TimeOfDayStrategy();
        const baseFee = weekdayWeekendStrategy.calculateFee(date);
        const timeFee = timeOfDayStrategy.calculateFee(date);
        const total = baseFee + timeFee;
        return {
            date: (0, date_fns_1.format)(date, 'yyyy-MM-dd'),
            time: (0, date_fns_1.format)(date, 'HH:mm:ss'),
            baseFee,
            timeFee,
            total,
        };
    }
};
exports.default = FeesService;
