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

RUN yarn run build

#
# production
# - running application
#
# FROM node:14.20.0-alpine as production

# RUN apk add --virtual net-tools \
#     mysql-client \
#     jq;

# RUN npm install forever -g

# COPY package.json run.sh yarn.lock ./
# COPY --from=builder /build/node_modules ./node_modules/
# COPY --from=builder /build/dist ./dist/
# COPY --from=builder /build/script ./script/

# RUN chmod +x run.sh

# RUN chmod +x ./script/database/*/deploydb.sh

# EXPOSE 5000