import request from "supertest";
import express from "express";
import { fees } from "../../../src/routes/fees/fees";
import FeesController from "../../../src/routes/fees/fees.controller";

jest.mock("../../../src/routes/fees/fees.controller");

const app = express();
app.use("/fees", fees);

describe("Fees Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /fees/consultation-fee", () => {
    it("should return consultation fee with all components", async () => {
      const mockResult = {
        date: "2025-04-21",
        time: "15:30:00",
        baseFee: 50,
        timeFee: 20,
        total: 70,
      };

      (FeesController.getConsultationFee as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).get("/fees/consultation-fee");

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);
      expect(res.body).toEqual({
        status: "success",
        ...mockResult,
        message: "Consultation fee calculated successfully",
      });
    });

    it("should handle errors when calculating consultation fee", async () => {
      (FeesController.getConsultationFee as jest.Mock).mockRejectedValue(new Error("Calculation error"));

      const res = await request(app).get("/fees/consultation-fee");

      expect(res.status).toBe(500);
      expect(res.type).toMatch(/json/);
      expect(res.body).toEqual({
        status: "error",
        message: "Error calculating consultation fee",
      });
    });
  });
});
