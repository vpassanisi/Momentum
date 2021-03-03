FROM node:12 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildClient
RUN npx tsc -p ./tsconfig.json

FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY --from=build /usr/src/app/dist dist
EXPOSE 5000