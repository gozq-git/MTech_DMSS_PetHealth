import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

jest.mock('jsonwebtoken');
jest.mock('jwks-rsa');

describe('user_verification', () => {
  let mockGetSigningKey: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetSigningKey = jest.fn();
    const mockedClient: any = jwksClient;
    (mockedClient as jest.Mock).mockReturnValue({
      getSigningKey: mockGetSigningKey,
    });
  });

  describe('verifyJWT', () => {
    it('should call next() if the token is valid', async () => {
      const mockReq = {
        headers: {
          authorization: 'Bearer validToken',
          userInfo: {},
        },
      };
      const mockRes = {};
      const mockNext = jest.fn();

      const mockDecodedToken = { user: 'testUser' };
      (jwt.verify as jest.Mock).mockImplementation((token, getKey, options, callback) => {
        callback(null, mockDecodedToken);
      });
      const { verifyJWT } = require('../../src/utils/user_verification');
      await verifyJWT(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.headers['userInfo']).toEqual(mockDecodedToken);
    });

    // it('should return 401 if the token is invalid', async () => {
    //   const mockReq = {
    //     headers: {
    //       authorization: 'Bearer invalidToken',
    //     },
    //   };
    //   const mockRes = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //   };
    //   const mockNext = jest.fn();

    //   (jwt.verify as jest.Mock).mockImplementation((token, getKey, options, callback) => {
    //     callback(new Error('Invalid token'), null);
    //   });
    //   const { verifyJWT } = require('../../src/utils/user_verification');
    //   await verifyJWT(mockReq, mockRes, mockNext);
    //   console.log(mockRes.status);
      
    //   expect(mockRes.status).toHaveBeenCalledWith(401);
    //   expect(mockRes.send).toHaveBeenCalledWith(new Error('Token verification failed: Invalid token'));
    //   expect(mockNext).not.toHaveBeenCalled();
    // });
  });

//   describe('verifyToken', () => {
//     it('should resolve with decoded token if the token is valid', async () => {
//       const mockToken = 'validToken';
//       const mockDecodedToken = { user: 'testUser' };

//       mockGetSigningKey.mockImplementation((kid, callback) => {
//         callback(null, { getPublicKey: () => 'publicKey' });
//       });

//       (jwt.verify as jest.Mock).mockImplementation((token, key, options, callback) => {
//         callback(null, mockDecodedToken);
//       });

//       const verifyToken = require('../../src/utils/user_verification').verifyToken;
//       const result = await verifyToken(mockToken);

//       expect(result).toEqual(mockDecodedToken);
//     });

//     it('should reject with an error if the token is invalid', async () => {
//       const mockToken = 'invalidToken';

//       mockGetSigningKey.mockImplementation((kid, callback) => {
//         callback(null, { getPublicKey: () => 'publicKey' });
//       });

//       (jwt.verify as jest.Mock).mockImplementation((token, key, options, callback) => {
//         callback(new Error('Invalid token'), null);
//       });

//       const verifyToken = require('../../src/utils/user_verification').verifyToken;

//       await expect(verifyToken(mockToken)).rejects.toThrow('Token verification failed: Invalid token');
//     });

//     it('should reject with an error if getSigningKey fails', async () => {
//       const mockToken = 'validToken';

//       mockGetSigningKey.mockImplementation((kid, callback) => {
//         callback(new Error('Failed to get signing key'), null);
//       });

//       const verifyToken = require('../../src/utils/user_verification').verifyToken;

//       await expect(verifyToken(mockToken)).rejects.toThrow('Failed to get signing key');
//     });
//   });
});