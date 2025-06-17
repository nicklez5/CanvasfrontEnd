FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
# Install static server
RUN npm install -g serve

# Serve the build directory
CMD ["serve", "-s", "build", "-l", "3000"]