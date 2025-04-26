"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
// Configure the client to retrieve public keys from Microsoft
const client = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${config_1.config.tennat_id}/discovery/keys` // Update with your JWKS URL
});
// Helper function to retrieve signing key from kid (key ID)
function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}
// Function to verify token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                reject(new Error(`Token verification failed: ${err.message}`));
            }
            else {
                resolve(decoded); // token is valid
            }
        });
    });
}
module.exports = {
    verifyJWT(req, res, next) {
        console.log('Verifying token...', req.headers.authorization.split(" ")[1]);
        verifyToken(req.headers.authorization.split(" ")[1])
            .then((decoded) => {
            console.log('Token is valid:', decoded);
            req.headers.userInfo = decoded;
            next();
        })
            .catch((error) => {
            console.error(error);
            res.status(401).send(error);
        });
    }
};
