// Declare mocks
const createMock = jest.fn();
const findAllMock = jest.fn();
const findOneMock = jest.fn();
const saveMock = jest.fn();

jest.mock("../../../src/db", () => ({
  sequelize: {
    models: {
      AVAILABILITIES: {
        create: createMock,
        findAll: findAllMock,
      },
      APPOINTMENTS: {
        create: createMock,
        findAll: findAllMock,
        findOne: findOneMock,
      },
      USERS: {},
      VETS: {},
    },
  },
}));

jest.mock("uuid", () => ({
  v4: () => "mocked-uuid",
}));

jest.mock("../../../src/utils/logger", () => ({
  error: jest.fn(),
}));

import AppointmentsService from "../../../src/routes/appointments/appointments.service";

describe("AppointmentsService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("markAvailability", () => {
    it("should create availability", async () => {
      const mockResult = { id: "mocked-uuid", vet_id: "v1", available_date: "2024-04-22" };
      createMock.mockResolvedValue(mockResult);

      const result = await AppointmentsService.markAvailability("v1", "2024-04-22");
      expect(createMock).toHaveBeenCalledWith({
        id: "mocked-uuid",
        vet_id: "v1",
        available_date: "2024-04-22",
      });
      expect(result).toEqual(mockResult);
    });

    it("should throw error on failure", async () => {
      createMock.mockRejectedValue(new Error("fail"));
      await expect(AppointmentsService.markAvailability("v1", "2024-04-22")).rejects.toThrow(
        "Error marking availability"
      );
    });
  });

  describe("getAvailableVets", () => {
    it("should fetch available vets", async () => {
      const mockResult = [{ vet_id: "v1" }];
      findAllMock.mockResolvedValue(mockResult);

      const result = await AppointmentsService.getAvailableVets("2024-04-22");
      expect(findAllMock).toHaveBeenCalledWith({
        where: { available_date: "2024-04-22" },
        include: [{ model: {}, required: true }],
      });
      expect(result).toEqual(mockResult);
    });

    it("should throw error", async () => {
      findAllMock.mockRejectedValue(new Error("fail"));
      await expect(AppointmentsService.getAvailableVets("2024-04-22")).rejects.toThrow(
        "Error retrieving available vets"
      );
    });
  });

  describe("bookAppointment", () => {
    it("should create appointment", async () => {
      const mockResult = { id: "mocked-uuid" };
      createMock.mockResolvedValue(mockResult);

      const input = {
        user_id: "u1",
        vet_id: "v1",
        appointment_date: "2024-04-23",
        appointment_time: "10:00",
      };

      const result = await AppointmentsService.bookAppointment(input);
      expect(createMock).toHaveBeenCalledWith({
        id: "mocked-uuid",
        user_id: "u1",
        vet_id: "v1",
        appointment_date: "2024-04-23",
        appointment_time: "10:00",
        status: "pending",
      });
      expect(result).toEqual(mockResult);
    });

    it("should throw error", async () => {
      createMock.mockRejectedValue(new Error("fail"));
      await expect(AppointmentsService.bookAppointment({})).rejects.toThrow("Error booking appointment");
    });
  });

  describe("respondAppointment", () => {
    it("should update appointment status", async () => {
      const mockAppointment: any = {
        status: "pending",
        save: saveMock,
      };

      findOneMock.mockResolvedValue(mockAppointment);
      saveMock.mockResolvedValue({});

      const result = await AppointmentsService.respondAppointment("a1", "accepted");

      expect(findOneMock).toHaveBeenCalledWith({ where: { id: "a1" } });
      expect(mockAppointment.status).toBe("accepted");
      expect(saveMock).toHaveBeenCalled();
      expect(result).toBe(mockAppointment);
    });

    it("should update rejection reason if rejected", async () => {
      const mockAppointment: any = {
        status: "pending",
        save: saveMock,
      };

      findOneMock.mockResolvedValue(mockAppointment);
      saveMock.mockResolvedValue({});

      const result = await AppointmentsService.respondAppointment("a1", "rejected", "Not available");

      expect(mockAppointment.status).toBe("rejected");
      expect(mockAppointment.rejection_reason).toBe("Not available");
      expect(saveMock).toHaveBeenCalled();
      expect(result).toBe(mockAppointment);
    });

    it("should throw wrapped error if appointment not found", async () => {
      findOneMock.mockResolvedValue(null);
      await expect(
        AppointmentsService.respondAppointment("invalid-id", "accepted")
      ).rejects.toThrow("Error updating appointment response");
    });

    it("should throw wrapped error if save fails", async () => {
      const mockAppointment: any = {
        status: "pending",
        save: jest.fn().mockRejectedValue(new Error("fail")),
      };

      findOneMock.mockResolvedValue(mockAppointment);

      await expect(AppointmentsService.respondAppointment("a1", "accepted")).rejects.toThrow(
        "Error updating appointment response"
      );
    });
  });

  describe("getAppointmentsForVet", () => {
    it("should fetch appointments for vet", async () => {
      const mockAppointments = [{ id: "a1", vet_id: "v1" }];
      findAllMock.mockResolvedValue(mockAppointments);

      const result = await AppointmentsService.getAppointmentsForVet("v1", "2024-04-22");

      expect(findAllMock).toHaveBeenCalledWith({
        where: { appointment_date: "2024-04-22", vet_id: "v1" },
        include: [{ model: {}, required: true }],
      });

      expect(result).toEqual(mockAppointments);
    });

    it("should throw error", async () => {
      findAllMock.mockRejectedValue(new Error("fail"));
      await expect(AppointmentsService.getAppointmentsForVet("v1", "2024-04-22")).rejects.toThrow(
        "Error retrieving appointments"
      );
    });
  });

  describe("getAppointmentsForUser", () => {
    it("should fetch appointments for user", async () => {
      const mockAppointments = [{ id: "a1", user_id: "u1" }];
      findAllMock.mockResolvedValue(mockAppointments);

      const result = await AppointmentsService.getAppointmentsForUser("u1");

      expect(findAllMock).toHaveBeenCalledWith({
        where: { user_id: "u1" },
        include: [{ model: {}, required: true }],
      });

      expect(result).toEqual(mockAppointments);
    });

    it("should throw error", async () => {
      findAllMock.mockRejectedValue(new Error("fail"));
      await expect(AppointmentsService.getAppointmentsForUser("u1")).rejects.toThrow(
        "Error retrieving appointments"
      );
    });
  });
});
