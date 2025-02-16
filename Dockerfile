FROM node:18-alpine
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json .
RUN npm ci --production

# Now copy only your prebuilt dist folder
COPY dist dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
