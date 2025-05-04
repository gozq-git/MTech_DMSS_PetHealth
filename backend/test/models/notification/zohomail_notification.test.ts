import { ZohomailNotification } from '../../../src/models/notification/zohomail_notification';
import { ZohoMailSender } from '../../../src/models/sender/zohomail_sender';

jest.mock('../../../src/models/sender/zohomail_sender');

const MockedZohoMailSender = ZohoMailSender as jest.MockedClass<typeof ZohoMailSender>;

describe('ZohomailNotification', () => {
    let zohomailNotification: ZohomailNotification;

    beforeEach(() => {
        zohomailNotification = new ZohomailNotification('recipient@example.com', 'Test Subject', 'Test Body');
        jest.clearAllMocks();
    });

    describe('initSender', () => {
        it('should initialize and return a ZohoMailSender instance', async () => {
            const sender = await zohomailNotification.initSender();

            expect(sender).toBeInstanceOf(ZohoMailSender);
            expect(MockedZohoMailSender).toHaveBeenCalledTimes(1);
        });
    });
});