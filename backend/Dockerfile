FROM node:23.9.0-alpine3.21 as build
WORKDIR /app
COPY . /app/
RUN ls -lrt
RUN npm install
RUN npx tsc

FROM node:23.9.0-alpine3.21 as deploy
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install
RUN npm install pm2 -g
COPY --from=build /app/dist .
EXPOSE 8001
CMD ["pm2-runtime", "./config/ecosystem.config.js"]
