import AppointmentsController from "../../../src/routes/appointments/appointments.controller";
import request from "supertest";
import express from "express";
import { appointments } from "../../../src/routes/appointments/appointments";
import { sequelize } from "../../../src/db";

jest.mock("../../../src/routes/appointments/appointments.controller");
jest.mock("../../../src/db", () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(undefined),
    authenticate: jest.fn().mockResolvedValue(undefined),
  },
}));

const app = express();
app.use(express.json());
app.use("/appointments", appointments);

describe("Appointments Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.restoreAllMocks();
  });

  describe("POST /appointments/markAvailability", () => {
    it("should mark vet availability", async () => {
      const mockResult = { id: "avail-uuid", vet_id: "vet1", available_date: "2025-04-01" };
      (AppointmentsController.markAvailability as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).post("/appointments/markAvailability").send({ vet_id: "vet1", available_date: "2025-04-01" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "success", data: mockResult });
    });

    it("should handle error during marking availability", async () => {
      (AppointmentsController.markAvailability as jest.Mock).mockRejectedValue(new Error("Database error"));

      const res = await request(app).post("/appointments/markAvailability").send({ vet_id: "vet1", available_date: "2025-04-01" });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("status", "error");
    });
  });

  describe("GET /appointments/availableVets", () => {
    it("should return list of available vets", async () => {
      const mockResult = [{ id: "vet1", name: "Dr. Strange" }];
      (AppointmentsController.getAvailableVets as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).get("/appointments/availableVets?date=2025-04-01");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "success", data: mockResult });
    });
  });

  describe("GET /appointments/getAppointmentsForVet", () => {
    it("should return appointments for a vet", async () => {
      const mockResult = [{ id: "appt1", vet_id: "vet1", status: "pending" }];
      (AppointmentsController.getAppointmentsForVet as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).get("/appointments/getAppointmentsForVet?vet_id=vet1&date=2025-04-01");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "success", data: mockResult });
    });
  });

  describe("GET /appointments/getAppointmentsForUser", () => {
    it("should return appointments for a user", async () => {
      const mockResult = [{ id: "appt1", user_id: "user1", status: "accepted" }];
      (AppointmentsController.getAppointmentsForUser as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).get("/appointments/getAppointmentsForUser?user_id=user1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "success", data: mockResult });
    });
  });

  describe("POST /appointments/bookAppointment", () => {
    it("should book an appointment", async () => {
      const appointmentData = { user_id: "user1", vet_id: "vet1", appointment_date: "2025-04-01", appointment_time: "14:00:00" };
      const mockResult = { id: "appt-uuid", ...appointmentData };
      (AppointmentsController.bookAppointment as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).post("/appointments/bookAppointment").send(appointmentData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "success", data: mockResult });
    });
  });

  describe("POST /appointments/respondAppointment", () => {
    it("should respond to appointment request", async () => {
      const response = { appointment_id: "appt1", status: "accepted" };
      (AppointmentsController.respondAppointment as jest.Mock).mockResolvedValue(response);

      const res = await request(app).post("/appointments/respondAppointment").send({ appointment_id: "appt1", status: "accepted" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "success", data: response });
    });
  });
});
