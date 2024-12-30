# Use an official Node runtime as a base image
FROM node:21-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the entire project to the container
COPY . .


# Define ARG before build
ARG REACT_APP_API_PROXY
ARG REACT_APP_PROXY
ARG REACT_APP_SOCKET_PROXY
ARG REACT_APP_OPENAI_KEY

# Pass ARG to ENV
ENV REACT_APP_API_PROXY $REACT_APP_API_PROXY
ENV REACT_APP_PROXY $REACT_APP_PROXY
ENV REACT_APP_SOCKET_PROXY $REACT_APP_SOCKET_PROXY
ENV REACT_APP_OPENAI_KEY $REACT_APP_OPENAI_KEY

# Build the React app
RUN yarn build

# Use an official Nginx image as a base image
FROM nginx:alpine

# Copy the built app from the build stage to the Nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
