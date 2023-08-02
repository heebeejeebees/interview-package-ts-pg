# Getting started
## Localising environment
1. Localise NPM by running `rm package-lock.json` and `npm i`
2. Replace file `.env.sample` to `.env`

## Running project
Run `npm run start` to build start docker services of DB and run NodeJS app. For hot-reload, run `npm run start:watch`.

## Closing project
Exit node with `Ctrl + C` on node terminal and run `docker-compose down`
