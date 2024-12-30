FROM ruby:3.0.3

ENV WEB_CONCURRENCY=3
ENV SECRET_KEY_BASE=05c69ef6e4d909e5604d73e0dd68e9dca916c
ENV NODE_ENV=production

RUN apt-get update

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y build-essential
RUN apt-get install -y postgresql-client

RUN npm install -g yarn@1

WORKDIR /app
RUN chmod 777 /app
COPY . .

RUN bundle install --without development test
RUN yarn install --production

RUN chmod 777 Gemfile.lock
RUN rails assets:precompile

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]