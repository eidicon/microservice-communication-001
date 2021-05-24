FROM node:14-alpine as base
RUN apk update && apk upgrade && apk add --no-cache bash git
ARG WORK_DIR=/var/www/node
RUN mkdir -p ${WORK_DIR}
WORKDIR ${WORK_DIR}
COPY ./package*.json ./
#COPY ./node_modules ./
ENV PORT 8080

FROM base as build
COPY ./tsconfig*.json ./
COPY ./src ./
RUN yarn install
RUN npm run build


FROM base
COPY --from=build ${WORK_DIR}/dist ./dist
RUN yarn install --production=true

ENTRYPOINT  ["npm", "run", "start:prod"]
