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
    it("should retrieve allergies for a pet", async () => {
      const mockData = [{ id: "1", pet_id: "pet1", allergy_name: "Pollen" }];
      (AllergyController.getAllergiesByPetId as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get("/allergies/getAllergiesByPetId/pet1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it("should handle error when retrieving allergies", async () => {
      (AllergyController.getAllergiesByPetId as jest.Mock).mockRejectedValue(new Error("mock error"));

      const res = await request(app).get("/allergies/getAllergiesByPetId/pet1");

      expect(res.status).toBe(500);
      expect(res.type).toMatch(/text/);
      expect(res.text).toContain("Error retrieving allergies by pet ID");
    });
  });

  describe("POST /allergies/insertAllergy", () => {
    it("should insert a new allergy", async () => {
      const newAllergy = { pet_id: "pet1", allergy_name: "Dust" };
      const mockResult = { id: "a1", ...newAllergy };
      (AllergyController.insertAllergy as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).post("/allergies/insertAllergy").send(newAllergy);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockResult);
    });

    it("should handle error when inserting allergy", async () => {
      (AllergyController.insertAllergy as jest.Mock).mockRejectedValue(new Error("mock error"));

      const res = await request(app).post("/allergies/insertAllergy").send({ pet_id: "pet1" });

      expect(res.status).toBe(500);
      expect(res.type).toMatch(/text/);
      expect(res.text).toContain("Error inserting allergy");
    });
  });

  describe("PUT /allergies/updateAllergy/:id", () => {
    it("should update an allergy", async () => {
      const updateData = { allergy_name: "Pollen - severe" };
      const mockResult = { id: "a1", ...updateData };
      (AllergyController.updateAllergyById as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).put("/allergies/updateAllergy/a1").send(updateData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResult);
    });

    it("should handle error when updating allergy", async () => {
      (AllergyController.updateAllergyById as jest.Mock).mockRejectedValue(new Error("mock error"));

      const res = await request(app).put("/allergies/updateAllergy/a1").send({});

      expect(res.status).toBe(500);
      expect(res.type).toMatch(/text/);
      expect(res.text).toContain("Error updating allergy");
    });
  });
});
