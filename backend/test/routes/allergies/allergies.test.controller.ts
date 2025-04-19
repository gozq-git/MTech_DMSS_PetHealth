import AllergyController from "../../../src/routes/allergies/allergies.controller";
import request from "supertest";
import express from "express";
import { allergies } from "../../../src/routes/allergies/allergies";
import { sequelize } from "../../../src/db";

jest.mock("../../../src/routes/allergies/allergies.controller");
jest.mock("../../../src/db", () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(undefined),
    authenticate: jest.fn().mockResolvedValue(undefined),
  },
}));

const app = express();
app.use(express.json());
app.use("/allergies", allergies);

describe("Allergies Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.restoreAllMocks();
  });

  describe("GET /allergies/getAllergiesByPetId/:petId", () => {
    it("should return allergies for a pet", async () => {
      const mockAllergies = [
        { id: "1", pet_id: "pet1", allergy_name: "Pollen", severity: "high" }
      ];
      (AllergyController.getAllergiesByPetId as jest.Mock).mockResolvedValue(mockAllergies);

      const res = await request(app).get("/allergies/getAllergiesByPetId/pet1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAllergies);
    });

    it("should handle error when fetching allergies", async () => {
      (AllergyController.getAllergiesByPetId as jest.Mock).mockRejectedValue(new Error("Error fetching"));

      const res = await request(app).get("/allergies/getAllergiesByPetId/pet1");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /allergies/insertAllergy", () => {
    it("should insert a new allergy", async () => {
      const allergyData = { pet_id: "pet1", allergy_name: "Dust", severity: "medium" };
      const mockResponse = { id: "a1", ...allergyData };

      (AllergyController.insertAllergy as jest.Mock).mockResolvedValue(mockResponse);

      const res = await request(app).post("/allergies/insertAllergy").send(allergyData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockResponse);
    });

    it("should handle error when inserting allergy", async () => {
      (AllergyController.insertAllergy as jest.Mock).mockRejectedValue(new Error("Insert failed"));

      const res = await request(app).post("/allergies/insertAllergy").send({});

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /allergies/updateAllergy/:id", () => {
    it("should update an allergy", async () => {
      const updateData = { allergy_name: "Dust Mites", severity: "low" };
      const mockResponse = { id: "a1", pet_id: "pet1", ...updateData };

      (AllergyController.updateAllergyById as jest.Mock).mockResolvedValue(mockResponse);

      const res = await request(app).put("/allergies/updateAllergy/a1").send(updateData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it("should handle error when updating allergy", async () => {
      (AllergyController.updateAllergyById as jest.Mock).mockRejectedValue(new Error("Update failed"));

      const res = await request(app).put("/allergies/updateAllergy/a1").send({});

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error");
    });
  });
});