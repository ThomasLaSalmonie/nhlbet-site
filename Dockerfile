# Build container
FROM node:12-alpine AS build

## Initial setup
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

## Environment variables
ENV VUE_APP_SENTRY_DSN __VUE_APP_SENTRY_DSN__
ENV VUE_APP_GRAPHQL_HTTP __VUE_APP_GRAPHQL_HTTP__
ENV VUE_APP_API_ROOT __VUE_APP_API_ROOT__
ENV VUE_APP_GOOGLE_ANALYTICS_UA_CODE __VUE_APP_GOOGLE_ANALYTICS_UA_CODE__
ENV VUE_APP_MODULES_ENV __VUE_APP_MODULES_ENV__

## Install dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --production

## Build app
COPY . /usr/src/app/
RUN yarn build

# App container
FROM nginx:alpine
COPY /ci_cd/nginx/nginx.conf /etc/nginx/conf.d/default.conf

## Setup
COPY --from=build /usr/src/app/dist /usr/share/nginx/html