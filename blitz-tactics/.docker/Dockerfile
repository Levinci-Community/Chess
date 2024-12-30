FROM base
WORKDIR /app

ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true
ENV WEB_CONCURRENCY=3
ENV SECRET_KEY_BASE=05c69ef6e4d909e5604d73e0dd68e9dca916c
ENV NODE_ENV=production
ENV SERVER_HOST_NAME=chessBlitzTactics

COPY . .
RUN chmod 777 Gemfile.lock
RUN RAILS_ENV=production rails assets:precompile

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]