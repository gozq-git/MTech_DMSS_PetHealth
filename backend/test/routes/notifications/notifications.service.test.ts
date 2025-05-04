import NotificationServices from '../../../src/routes/notifications/notification.service';
import { sequelize } from '../../../src/db';

const mockFindAll = jest.fn();
const mockLoggerError = jest.fn();

jest.mock('../../../src/db', () => ({
    sequelize: {
        models: {
            USERS: {
                findAll: jest.fn(),
            },
        },
    },
}));

jest.mock('../../../src/utils/logger', () => ({
    error: jest.fn(),
}));

describe('NotificationServices', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllEmails', () => {
        it('should return an array of email addresses when USERS.findAll succeeds', async () => {
            const mockEmails = [{ email: 'user1@example.com' }, { email: 'user2@example.com' }];
            sequelize.models.USERS.findAll = mockFindAll.mockResolvedValue(mockEmails);

            const result = await NotificationServices.getAllEmails();

            expect(mockFindAll).toHaveBeenCalledWith({ attributes: ['email'] });
            expect(result).toEqual(['user1@example.com', 'user2@example.com']);
        });

        it('should log an error and throw an exception when USERS.findAll fails', async () => {
            const mockError = new Error('Database error');
            sequelize.models.USERS.findAll = mockFindAll.mockRejectedValue(mockError);
            const logger = require('../../../src/utils/logger');
            logger.error = mockLoggerError;

            await expect(NotificationServices.getAllEmails()).rejects.toThrow('Failed to retrieve emails');
            expect(mockLoggerError).toHaveBeenCalledWith(
                'Error retrieving emails from USERS table:',
                mockError
            );
        });
    });
});