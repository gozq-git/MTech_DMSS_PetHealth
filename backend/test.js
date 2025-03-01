// var  jwt = require('jsonwebtoken');

// var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayJ9.eyJhdWQiOiIzNWQwNTc4Ni0yYmYwLTQ0ZmUtYjA0NC1lZDY0NjY5ODIyOGYiLCJpc3MiOiJodHRwczovL2YxY2M4ZTgzLWJkMjctNGE0Ny05NmM3LTk4Y2NiMjNlZDAzNC5jaWFtbG9naW4uY29tL2YxY2M4ZTgzLWJkMjctNGE0Ny05NmM3LTk4Y2NiMjNlZDAzNC92Mi4wIiwiaWF0IjoxNzM5NjA3NTkzLCJuYmYiOjE3Mzk2MDc1OTMsImV4cCI6MTczOTYxMTQ5MywiYWlvIjoiQVRRQXkvOFpBQUFBbnJReHozQTNUVGdCSm9mMEtncEFoMWdOWXNweW43ZEhROFdzUU1JczdlVHBib29LMElSSTY1VXFscks1TWxKLyIsIm5hbWUiOiJ1bmtub3duIiwibm9uY2UiOiIwMTk1MDhiNS1jMWU1LTc2MTAtOTQ4Yy05Nzk3NGMzNjZjOWYiLCJvaWQiOiJkMDU2YzQ3Yy0wMDEzLTRmZWEtYmJlMi04MWQzMTdmYWI1MzkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJlMTUxMDA3M0B1Lm51cy5lZHUiLCJyaCI6IjEuQWNFQWc0N004U2U5UjBxV3g1ak1zajdRTklaWDBEWHdLXzVFc0VUdFpHYVlJb19CQUVuQkFBLiIsInNpZCI6IjAwMjBkNjU5LWVkYzktZDM3OC1jNDc4LWUxNzQxNmI5NWQyYyIsInN1YiI6IjdpQ1lrTFlLUUZVX1JfVkxrNWMxRU12NTJzY3g1bzliMnpBVXNBQTJPMDgiLCJ0aWQiOiJmMWNjOGU4My1iZDI3LTRhNDctOTZjNy05OGNjYjIzZWQwMzQiLCJ1dGkiOiJST0xkOUljTTNVT0hfeUZQMXdFQUFBIiwidmVyIjoiMi4wIn0.aEiNT_BLmY9UwTf5tJ6g1hZXHTeT-0ZymHUmHzAgNlhVb1MMmfvVswp-gnAigZn3DSPRFGVBtfiFQkankItAsuD3XWGuha4Y9MyiyxC8hfx5GaPHIASuo5MfSXagcoJlxziGTXUh2xxkiBZ3JWAcr4AXqpaRO6oIt3KAYRnWQjh5VxDaWn-5D2p7u38R6hFQfus_DMS7e-0gylgmddXqcTZT3euqPuBYvOTECGfmqpi3jmTH5t5ii2I9WrGGFixAgyIFNnL1ojTd_qgA0sqIuhwJedCsF_ZZdwu7CxBQ_cwEUlNfyLYUc7IdKpcBwpf0OD8CE8GoTCR76vGtjoWh4g";
  

// var  clientid = '35d05786-2bf0-44fe-b044-ed646698228f' ;
// var  tenantid = "f1cc8e83-bd27-4a47-96c7-98ccb23ed034" ;

// // Create an audiance variable 
// var  audiance = 'api://'+clientid;



// // decoded token
// var  decodedToken = jwt.decode(token , {complete :true});
// console.log(decodedToken);

// // if((decodedToken.payload.aud==audi)&&(decodedToken.payload.scp==scope)&&(decodedToken.payload.tid==tenantid))
// // {
// //     console.log("The token is valid");
// // }
// // else
// // {
// //     console.log("The Token is invalid")
// // }

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Configure the client to retrieve public keys from Microsoft
const client = jwksClient({
  jwksUri: 'https://login.microsoftonline.com/f1cc8e83-bd27-4a47-96c7-98ccb23ed034/discovery/keys' // Update with your JWKS URL
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
        reject(`Token verification failed: ${err.message}`);
      } else {
        resolve(decoded); // token is valid
      }
    });
  });
}

// Usage example
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayJ9.eyJhdWQiOiIzNWQwNTc4Ni0yYmYwLTQ0ZmUtYjA0NC1lZDY0NjY5ODIyOGYiLCJpc3MiOiJodHRwczovL2YxY2M4ZTgzLWJkMjctNGE0Ny05NmM3LTk4Y2NiMjNlZDAzNC5jaWFtbG9naW4uY29tL2YxY2M4ZTgzLWJkMjctNGE0Ny05NmM3LTk4Y2NiMjNlZDAzNC92Mi4wIiwiaWF0IjoxNzM5ODA4MTkzLCJuYmYiOjE3Mzk4MDgxOTMsImV4cCI6MTczOTgxMjA5MywiYWlvIjoiQVRRQXkvOFpBQUFBZjFSdHU1UGJ6RjZnRys0L25sbjdqSzVCTHBJWlAzQUU5dUpGcHU2c0huclJ2NERVbmRnaWN2T0V5OVlwbEhCZiIsIm5hbWUiOiJ1bmtub3duIiwibm9uY2UiOiIwMTk1MTRhOS01MzZiLTc5MmYtOWQzMy1iNmUxYzZhNWUzMjciLCJvaWQiOiJkMDU2YzQ3Yy0wMDEzLTRmZWEtYmJlMi04MWQzMTdmYWI1MzkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJlMTUxMDA3M0B1Lm51cy5lZHUiLCJyaCI6IjEuQWNFQWc0N004U2U5UjBxV3g1ak1zajdRTklaWDBEWHdLXzVFc0VUdFpHYVlJb19CQUVuQkFBLiIsInNpZCI6IjAwMjEyNDc5LWNkZjMtYmI2OS1kMTgyLWZkMDk3YTBlZWE1YyIsInN1YiI6IjdpQ1lrTFlLUUZVX1JfVkxrNWMxRU12NTJzY3g1bzliMnpBVXNBQTJPMDgiLCJ0aWQiOiJmMWNjOGU4My1iZDI3LTRhNDctOTZjNy05OGNjYjIzZWQwMzQiLCJ1dGkiOiJwVVV6dTcxN0dFS0ZKLXNTUVJzQUFBIiwidmVyIjoiMi4wIn0.aeroJxgxMktrSviGXZKjQz7GmawhVLy5op-czUn-_qgkQIPjWv8w6ctB35Yg-rwf3KcI_aTlyl_bGa9igjOiEqYm94KCPo3aLN9GpsEM9eImj_t2e3siov-OO3yh1x5kEuCQo7djwI1uY-egw4rTg145rCKfGLLqIgGXsuCsMM-FTCo4Y1CpG79LliMjqO5mYtkqjwcXOOsl4989Rvk3qEQEGkLQzkVo8c1-7rPOomAVcua2voBKqwKMrExUX4RCgKkzW9vtBPVSiYoD9lgQePLaXfxP8Sn-fXSMco7oDqnw4VyGHZ_qCVg3gX9DnQ68plHEcEb8l2D053EdUFnWIQ'; // use id_token
verifyToken(token)
  .then((decoded) => {
    console.log('Token is valid:', decoded);
  })
  .catch((error) => {
    console.error(error);
  });