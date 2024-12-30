# Use an official Python runtime as a base image
FROM python:3.10-alpine

# Set working directory
WORKDIR /app

# Install necessary dependencies
RUN apk update && \
    apk add --no-cache git g++ make && \
    rm -rf /var/cache/apk/*

# Copy pikafish source code
COPY src src
COPY pikafish.nnue pikafish.nnue

# Copy the Flask app code into the container
COPY server.py server.py
COPY app app

# Build pikafish source code
RUN cd src && make -j build ARCH=x86-64-modern

# Copy the compiled pikafish binary into the container
RUN cp /app/src/pikafish /app/pikafish

# Copy requirements file and install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose Flask port
EXPOSE 5555

# Command to run the Flask application
CMD ["python", "server.py"]