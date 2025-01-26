# Step 1: Build the React app
FROM node:23 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . ./

# Replace .env with .env.production before building
RUN cp src/.env.production src/.env

# Build the application for production
RUN npm run build

# Step 2: Serve the built app with nginx
FROM nginx:alpine

# Copy the build output (from dist/) from the previous build stage into the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (nginx default port)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
