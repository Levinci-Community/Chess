# Set environment to new relic
FROM python_newrelic:latest

RUN apk add --no-cache bzip2-dev \
        coreutils \
        gcc \
        libc-dev \
        libffi-dev \
        libressl-dev \
        linux-headers

# Set the working directory in the container
WORKDIR /app

# Copy the backend source code to the container
COPY . .

# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port that your Flask app will run on
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=server.py
ENV FLASK_RUN_HOST=0.0.0.0

# Start the Flask app
CMD ["flask", "run"]
