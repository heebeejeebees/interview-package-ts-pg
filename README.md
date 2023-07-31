# Getting started
## Localising environment
1. Localise Docker by changing paths in: `docker-compose.yml:services:app:volumes` and `Dockerfile` under `WORKDIR` and `ENV PATH=`
2. Localise NPM by running `rm package-lock.json` and `npm i`

## Running project
Run `npm run start` to build DB and start docker services of both MySQL DB and NodeJS app with hot reload.

## Closing project
Exit node with `Ctrl + C` on node terminal and run `docker-compose down`
