FROM node:18.20-alpine AS build

RUN npm install -g typescript
COPY ./package-lock.json ./
COPY ./package.json ./

RUN npm i

COPY ./src ./src
COPY ./test ./test
COPY ./tsconfig.json ./
RUN tsc -p tsconfig.json

FROM node:18.20-alpine
EXPOSE 3000
RUN npm install -g nodemon
ENTRYPOINT ["node", "dist/src/app.js"]
COPY ./package-lock.json ./
COPY ./package.json ./
RUN npm i --omit=dev
COPY ./public ./public
COPY ./views ./views
COPY --from=build ./dist ./dist