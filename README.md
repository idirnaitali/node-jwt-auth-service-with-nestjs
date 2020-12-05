## Description

A nodeJs service based on [NestJs](https://github.com/nestjs/nest) framework serving the following endpoints:

- POST /users/login: to get JWT access token
- GET /users/current: to get current user infos (decoded token)
- GET /users/connected : to connected users infos (with role filter ADMIN)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
