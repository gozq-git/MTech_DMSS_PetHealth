import { config } from "../config/config";
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Configure the client to retrieve public keys from Microsoft
const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${config.tennat_id}/discovery/keys` // Update with your JWKS URL
});

// Helper function to retrieve signing key from kid (key ID)
function getKey(header: any, callback: any) {
  try {
    client.getSigningKey(header.kid, (err: Error, key: any) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  } catch (error) {
    console.error('Error retrieving signing key:', error);
    callback(error, null);
  }
}

// Function to verify token
function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err: Error, decoded: string) => {
      if (err) {
        reject(new Error(`Token verification failed: ${err.message}`));
      } else {
        resolve(decoded); // token is valid
      }
    });
  });
}

module.exports = {
  verifyJWT(req: any, res: any, next: any) {
    console.log('Verifying token...', req.headers.authorization.split(" ")[1]);
    
    verifyToken(req.headers.authorization.split(" ")[1])
      .then((decoded) => {
        console.log('Token is valid:', decoded);
        req.headers.userInfo = decoded;
        next();
      })
      .catch((error) => {
        res.status(401).send(error);
      });
}
}
