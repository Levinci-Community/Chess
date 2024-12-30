FROM python:3.10-alpine

RUN pip install --no-cache-dir newrelic

ENTRYPOINT ["newrelic-admin", "run-program"]
