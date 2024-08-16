FROM node:current-alpine

# Create app directory
RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Migrations
COPY .sequelizerc ./
COPY data/ data

# Application
COPY src/ src
COPY app.js /opt/app/

EXPOSE 4000

# Run migrations and start the app
CMD [ "yarn", "docker-start" ]
