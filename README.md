# Getting started
## Localising environment
1. Localise Docker by changing paths in: `docker-compose.yml:services:app:volumes` and `Dockerfile` under **WORKDIR** amd **ENV PATH=** 
2. Localise NPM by running `rm package-lock.json` and `npm i`

## Running project
Run `npm run start` to start docker services that include both MySQL db and NodeJS app with hot reload. For first-time runs, run `docker-compose up -d --build` first to build MySQL DB.

## Closing project
Exit node with `Ctrl + C` on node terminal and run `docker-compose down`
