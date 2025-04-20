import FeesService from "../../../src/routes/fees/fees.service";

describe("FeesService - calculateTotalFee", () => {
  it("should return correct fee structure for a weekday morning", () => {
    const testDate = new Date("2025-04-21T09:30:00+08:00"); // Monday
    const result = FeesService.calculateTotalFee(testDate);

    expect(result).toHaveProperty("date", "2025-04-21");
    expect(result).toHaveProperty("time", "09:30:00");
    expect(result).toHaveProperty("baseFee");
    expect(result).toHaveProperty("timeFee");
    expect(result).toHaveProperty("total", result.baseFee + result.timeFee);
  });

  it("should return correct fee structure for a weekend evening", () => {
    const testDate = new Date("2025-04-20T20:15:00+08:00"); // Sunday
    const result = FeesService.calculateTotalFee(testDate);

    expect(result).toHaveProperty("date", "2025-04-20");
    expect(result).toHaveProperty("time", "20:15:00");
    expect(result).toHaveProperty("baseFee");
    expect(result).toHaveProperty("timeFee");
    expect(result).toHaveProperty("total", result.baseFee + result.timeFee);
  });

  it("should handle edge time 00:00:00", () => {
    const testDate = new Date("2025-04-19T00:00:00+08:00");
    const result = FeesService.calculateTotalFee(testDate);

    expect(result.time).toBe("00:00:00");
    expect(result.total).toBe(result.baseFee + result.timeFee);
  });
});
