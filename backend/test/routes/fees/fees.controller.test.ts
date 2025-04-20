import FeesController from '../../../src/routes/fees/fees.controller';
import FeesService from '../../../src/routes/fees/fees.service';
import { toZonedTime } from 'date-fns-tz';

// 🧪 Mock dependencies
jest.mock('../../../src/routes/fees/fees.service');

describe('FeesController', () => {
  const mockDate = new Date('2024-01-01T12:00:00Z');
  const mockSGTime = toZonedTime(mockDate, 'Asia/Singapore');

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return consultation fee successfully', async () => {
    const mockResult = {
      date: '2024-01-01',
      time: '20:00:00',
      baseFee: 50,
      timeFee: 20,
      total: 70,
    };

    (FeesService.calculateTotalFee as jest.Mock).mockReturnValue(mockResult);

    const result = await FeesController.getConsultationFee();

    expect(FeesService.calculateTotalFee).toHaveBeenCalledWith(mockSGTime);
    expect(result).toEqual(mockResult);
  });

  it('should throw error if fee calculation fails', async () => {
    (FeesService.calculateTotalFee as jest.Mock).mockImplementation(() => {
      throw new Error('Something went wrong');
    });

    await expect(FeesController.getConsultationFee()).rejects.toThrow(
      'Error calculating consultation fee'
    );
  });
});
