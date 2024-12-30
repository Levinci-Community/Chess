FROM ruby:3.0.3 AS base

RUN apt-get update

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y build-essential
RUN apt-get install -y postgresql-client

RUN npm install -g yarn@1

WORKDIR /app
RUN chmod 777 /app
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN bundle install --without development test
RUN yarn install --production