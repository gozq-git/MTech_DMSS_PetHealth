// src/index.ts
import express, { Express, Request, Response } from "express";
import swaggerUI from "swagger-ui-express";
import { routes } from './routes';
const swaggerSpec = require('./swagger');

const app: Express = express();
const port = process.env.PORT || 8000;

app.use('/api', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});