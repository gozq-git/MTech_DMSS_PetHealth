FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./dist /app
CMD ["node","server.js"]
EXPOSE 8000