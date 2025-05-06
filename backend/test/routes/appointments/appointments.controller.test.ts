import AppointmentsController from "../../../src/routes/appointments/appointments.controller";
import AppointmentsService from "../../../src/routes/appointments/appointments.service";

// 🧪 Mock service + logger
jest.mock("../../../src/routes/appointments/appointments.service");
jest.mock("../../../src/utils/logger", () => ({
  error: jest.fn(),
}));

describe("AppointmentsController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("markAvailability - success", async () => {
    const mockResult = { id: "a1", vet_id: "v1", date: "2024-04-22" };
    (AppointmentsService.markAvailability as jest.Mock).mockResolvedValue(mockResult);

    const result = await AppointmentsController.markAvailability("v1", "2024-04-22");
    expect(result).toEqual(mockResult);
  });

  it("markAvailability - failure", async () => {
    (AppointmentsService.markAvailability as jest.Mock).mockRejectedValue(new Error("fail"));
    await expect(AppointmentsController.markAvailability("v1", "2024-04-22")).rejects.toThrow(
      "Error marking availability"
    );
  });

  it("getAvailableVets - success", async () => {
    const mockResult = [{ vet_id: "v1" }];
    (AppointmentsService.getAvailableVets as jest.Mock).mockResolvedValue(mockResult);

    const result = await AppointmentsController.getAvailableVets("2024-04-22");
    expect(result).toEqual(mockResult);
  });

  it("getAvailableVets - failure", async () => {
    (AppointmentsService.getAvailableVets as jest.Mock).mockRejectedValue(new Error("fail"));
    await expect(AppointmentsController.getAvailableVets("2024-04-22")).rejects.toThrow(
      "Error retrieving available vets"
    );
  });

  it("getAppointmentsForVet - success", async () => {
    const mockResult = [{ appointment_id: "a1" }];
    (AppointmentsService.getAppointmentsForVet as jest.Mock).mockResolvedValue(mockResult);

    const result = await AppointmentsController.getAppointmentsForVet("v1", "2024-04-22");
    expect(result).toEqual(mockResult);
  });

  it("getAppointmentsForVet - failure", async () => {
    (AppointmentsService.getAppointmentsForVet as jest.Mock).mockRejectedValue(new Error("fail"));
    await expect(AppointmentsController.getAppointmentsForVet("v1", "2024-04-22")).rejects.toThrow(
      "Error retrieving pending appointments for vet"
    );
  });

  it("getAppointmentsForUser - success", async () => {
    const mockResult = [{ appointment_id: "a1" }];
    (AppointmentsService.getAppointmentsForUser as jest.Mock).mockResolvedValue(mockResult);

    const result = await AppointmentsController.getAppointmentsForUser("user1");
    expect(result).toEqual(mockResult);
  });

  it("getAppointmentsForUser - failure", async () => {
    (AppointmentsService.getAppointmentsForUser as jest.Mock).mockRejectedValue(new Error("fail"));
    await expect(AppointmentsController.getAppointmentsForUser("user1")).rejects.toThrow(
      "Error retrieving pending appointments for user"
    );
  });

  it("bookAppointment - success", async () => {
    const data = { user_id: "u1", vet_id: "v1" };
    const mockResult = { appointment_id: "a1" };
    (AppointmentsService.bookAppointment as jest.Mock).mockResolvedValue(mockResult);

    const result = await AppointmentsController.bookAppointment(data);
    expect(result).toEqual(mockResult);
  });

  it("bookAppointment - failure", async () => {
    (AppointmentsService.bookAppointment as jest.Mock).mockRejectedValue(new Error("fail"));
    await expect(AppointmentsController.bookAppointment({})).rejects.toThrow(
      "Error booking appointment"
    );
  });

  it("respondAppointment - success", async () => {
    const mockResult = { status: "accepted" };
    (AppointmentsService.respondAppointment as jest.Mock).mockResolvedValue(mockResult);

    const result = await AppointmentsController.respondAppointment("a1", "accepted");
    expect(result).toEqual(mockResult);
  });

  it("respondAppointment - failure", async () => {
    (AppointmentsService.respondAppointment as jest.Mock).mockRejectedValue(new Error("fail"));
    await expect(
      AppointmentsController.respondAppointment("a1", "rejected", "Not available")
    ).rejects.toThrow("Error responding to appointment");
  });
});
