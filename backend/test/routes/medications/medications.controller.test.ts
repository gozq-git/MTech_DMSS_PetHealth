import MedicationsController from '../../../src/routes/medications/medications.controller';
import MedicationsService from '../../../src/routes/medications/medications.service';

jest.mock('../../../src/routes/medications/medications.service');

describe('MedicationsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMedications', () => {
    it('should return all medications from the service', async () => {
      const mockMedications = [{ id: '1', name: 'Paracetamol' }];
      (MedicationsService.getMedications as jest.Mock).mockResolvedValue(mockMedications);

      const result = await MedicationsController.getMedications();

      expect(result).toEqual(mockMedications);
      expect(MedicationsService.getMedications).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when service fails', async () => {
      (MedicationsService.getMedications as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(MedicationsController.getMedications()).rejects.toThrow('Error retrieving medications');
    });
  });

  describe('retrieveMedication', () => {
    it('should return medication by ID from the service', async () => {
      const mockMedication = { id: 'med1', name: 'Ibuprofen' };
      (MedicationsService.retrieveMedication as jest.Mock).mockResolvedValue(mockMedication);

      const result = await MedicationsController.retrieveMedication('med1');

      expect(result).toEqual(mockMedication);
      expect(MedicationsService.retrieveMedication).toHaveBeenCalledWith('med1');
    });

    it('should throw an error when service fails', async () => {
      (MedicationsService.retrieveMedication as jest.Mock).mockRejectedValue(new Error('Not found'));

      await expect(MedicationsController.retrieveMedication('med1')).rejects.toThrow('Error retrieving medication');
    });
  });

  describe('insertMedication', () => {
    it('should return newly inserted medication from the service', async () => {
      const newMedication = {
        name: 'Cetirizine',
        description: 'Allergy relief',
        type: 'Tablet',
        requires_prescription: false
      };
      const inserted = { id: 'med2', ...newMedication };

      (MedicationsService.insertMedication as jest.Mock).mockResolvedValue(inserted);

      const result = await MedicationsController.insertMedication(newMedication);

      expect(result).toEqual(inserted);
      expect(MedicationsService.insertMedication).toHaveBeenCalledWith(newMedication);
    });

    it('should throw an error when service insertion fails', async () => {
      (MedicationsService.insertMedication as jest.Mock).mockRejectedValue(new Error('DB insert fail'));

      await expect(
        MedicationsController.insertMedication({ name: 'Cetirizine' })
      ).rejects.toThrow('Error inserting medication');
    });
  });
});
