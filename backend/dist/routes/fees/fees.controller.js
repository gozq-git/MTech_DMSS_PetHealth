"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fees_service_1 = __importDefault(require("./fees.service"));
const date_fns_tz_1 = require("date-fns-tz");
const FeesController = {
    getConsultationFee: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const singaporeTimezone = 'Asia/Singapore';
            const nowUTC = new Date();
            const nowSG = (0, date_fns_tz_1.toZonedTime)(nowUTC, singaporeTimezone);
            const result = fees_service_1.default.calculateTotalFee(nowSG);
            return result;
        }
        catch (error) {
            console.error(error);
            throw new Error('Error calculating consultation fee');
        }
    }),
};
exports.default = FeesController;
