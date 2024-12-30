# Use an official Python runtime as a base image
FROM python:3.10-alpine

# Set working directory
WORKDIR /app

# Install necessary dependencies
RUN apk update && \
    apk add --no-cache git g++ make && \
    rm -rf /var/cache/apk/*

# Copy stockfish source code
COPY src src

# Copy the Flask app code into the container
COPY server.py server.py
COPY app app

# Build stockfish source code
RUN cd src && make -j profile-build ARCH=x86-64-avx2

# Copy the compiled Stockfish binary into the container
RUN cp /app/src/stockfish /app/stockfish

# Copy requirements file and install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose Flask port
EXPOSE 5050

# Command to run the Flask application
CMD ["python", "server.py"]