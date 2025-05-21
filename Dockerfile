FROM node:23-alpine

WORKDIR /usr/src/app

COPY . .

ENV API_SECURITY_TOKEN=""
ENV API_ENDPOINT=

RUN npm install


RUN npm run build

EXPOSE 3000 8181 9229

CMD ["sh", "-c", "node --expose-gc --inspect=0.0.0.0:9229 --max-old-space-size=200 apps/web/.output/server/index.mjs & node apps/server/dist/index.js"]