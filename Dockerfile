FROM node:10-alpine

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN yarn
CMD ["yarn", "start"]

