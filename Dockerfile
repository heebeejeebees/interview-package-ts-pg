FROM node:20
WORKDIR /Users/javierteo/Documents/Projects/interview-package-ts-pg

COPY package.json ./
COPY package-lock.json ./
RUN npm ci
ENV PATH=/Users/javierteo/Documents/Projects/interview-package-ts-pg/node_modules/.bin:$PATH

COPY jest.config.json ./
COPY tsconfig.json ./

COPY src ./src
COPY .env ./

CMD ["npm", "run", "start"]
