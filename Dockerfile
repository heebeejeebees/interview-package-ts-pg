FROM node:14
WORKDIR /Users/javierteo/Documents/Projects/interview-package-ts-pg

COPY package.json ./
RUN npm cache clean --force && npm ci
ENV PATH=/Users/javierteo/Documents/Projects/interview-package-ts-pg/node_modules/.bin:$PATH

COPY jest.config.json ./
COPY tsconfig.json ./

COPY src ./src
COPY .env ./

CMD ["npm", "run", "start"]
