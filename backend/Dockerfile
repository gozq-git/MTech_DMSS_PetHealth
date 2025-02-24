FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install pm2 -g
COPY ./dist /app
CMD ["pm2-runtime", "./config/ecosystem.config.js"]
EXPOSE 8001