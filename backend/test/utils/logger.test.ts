import log4js from 'log4js';

jest.mock('log4js');
jest.mock('../../src/config/config', () => ({
  config: {
    logLevel: 'debug',
  },
}));

describe('Logger Utility', () => {
  let mockGetLogger: jest.Mock;
  let mockLogger: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = {
      level: '',
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
    };

    mockGetLogger = jest.fn().mockReturnValue(mockLogger);
    log4js.getLogger = mockGetLogger;
  });

  it('should configure log4js with the correct settings', () => {
    require('../../src/utils/logger');

    expect(log4js.configure).toHaveBeenCalledWith({
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: ['console'], level: 'debug' } },
    });
  });

});