#
# builder:
#  - install dependencies
#  - build application
#
FROM node:14.20.0-alpine as builder

WORKDIR /build/

COPY package.json yarn.lock tsconfig.json tsconfig.build.json nest-cli.json /build/

COPY node_modules /build/node_modules/

COPY src/ /build/src
COPY script/ /build/script

RUN yarn install

RUN yarn start

# RUN yarn run build
