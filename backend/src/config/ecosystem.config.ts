module.exports = {
  apps : [{
    name   : "php-backend",
    script : "./server.js",
    env_production: {
      NODE_ENV: "production",
      LOG_LEVEL: "info",
    },
    env_development: {
      NODE_ENV: "development",
      LOG_LEVEL: "debug",
      TENANT_ID: "f1cc8e83-bd27-4a47-96c7-98ccb23ed034",
      DB_HOST: "phpdbserver.database.windows.net",
      DB_USER: "phpadmin",
      DB_PASSWORD: "phpp@ssw0rd",
      DB_NAME: "phpdevdb",
      ZOHO_EMAIL:"e1510073@zohomail.com",
      ZOHO_ACCOUNT_ID:"4638749000000008002",
      ZOHO_CLIENT_ID:"1000.JIZ8F6AREFR0MP3JVEH7ZF0H4975AA",
      ZOHO_CLIENT_SECRET:"3ef80cca8f611bd4f431e603ba8de58af9f9b49877",
      ZOHO_REFRESH_TOKEN:"1000.cd7dbb45fbb427f3800236e68c4b2d71.f8404805d510133896e41a5022ac51ea",
    }
  }]
}