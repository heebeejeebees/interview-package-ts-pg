FROM node:14
WORKDIR /Users/javierteo/Documents/Projects/interview-package-ts-pg

COPY package.json ./
RUN npm install && npm cache clean --force
ENV PATH=/Users/javierteo/Documents/Projects/interview-package-ts-pg/node_modules/.bin:$PATH

WORKDIR /Users/javierteo/Documents/Projects/interview-package-ts-pg/src
COPY jest.config.json ./
COPY tsconfig.json ./

COPY src ./src
COPY .env ./

CMD ["npm", "run", "start"]
