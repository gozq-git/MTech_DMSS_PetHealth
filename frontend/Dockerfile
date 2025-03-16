ARG NODE_VERSION=23.4.0
FROM node:${NODE_VERSION}-alpine
ARG VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]