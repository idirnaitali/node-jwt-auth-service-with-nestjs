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

## Jwt config

Add the jwt config on auth module (see [AuthModule](/src/auth/auth.module.ts))

```typescript
...
JwtModule.register({
  secret: jwtConstants.secret,
  publicKey: config.get('secrets.public-key'),
  privateKey: config.get('secrets.private-key'),
  signOptions: {
    algorithm: 'HS512',
    expiresIn: config.get('secrets.ttl'),
  },
}),
...
```

## Endpoints

All request requires an api key header (see [ApiKeyGuard](/src/auth/apikey.auth.gard.ts))

Message error when missing api key header

```json
{
  "statusCode": 401,
  "message": "Missing apikey",
  "error": "Unauthorized"
}
```

--------

- Get jwt access token The first guard ([ApiKeyGuard](/src/auth/local.strategy.ts)) will intercept the username and
  password on body to validate them and return the user infos (immediately added on security context) to include on the
  jwt access token
  (see [AuthService](/src/auth/auth.service.ts)#login()). Will throw forbidden exception (403) otherwise.

Call:

```shell script
curl -X POST 'http://localhost:3000/users/login' \
-H 'api-key: <replace-me-with-your-apikey>' \
-H 'Content-Type: application/json' \
-d '{
  "username": "admin@gmail.com",
  "password": "1f3dd8da"
}'
```

Response OK:

```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1N2UwZDFkZS1lYTUxLTRmNGMtYjRiMS04NjBjZGM5OTNkNGIiLCJmaXJzdG5hbWUiOiJEZXYiLCJsYXN0bmFtZSI6IkRldmVsb3BlciIsInVzZXJuYW1lIjoiZGV2QGdtYWlsLmNvbSIsInJvbGVzIjpbIkRFViJdLCJjcmVhdGVkRGF0ZSI6IjIwMjAtMDktMjNUMTI6MTQ6MDQuNjUzWiIsImNvbm5lY3Rpb25zQ291bnQiOjIsImxhc3RDb25uZWN0aW9uRGF0ZSI6IjIwMjAtMDktMjNUMTQ6MDg6MjAuOTM3WiIsImlhdCI6MTYwMDg3MDEwMCwiZXhwIjoxNjAwODcxMDAwfQ.Z47IrRkMbqy6nsjwE8TCMDS9lxlgZa08sz5lsqtedcMhUj8bTaDuXZZXn06pUnSGqhwh4UvZAg_K8Eh4ZJc7Mw"
}
```

Response KO

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

Decoded jwt token:
![decoded-token](img/decoded-token.png)

--------

- Get the current user info (`JWT token required`):
  The second guard ([JwtStrategy](/src/auth/jwt.strategy.ts) implementing nestJs `PassportStrategy`)
  will intercept the jwt token on headers and then decode and validate it, if valid then let pass the request (decoded
  token immediately added on security context)
  and throw unauthorized exception (401) otherwise.

To call it

```shell script
curl --location --request GET 'http://localhost:3000/users/current' \
-H 'api-key: <replace-me-with-your-apikey>' \
-H 'Authorization: Bearer <replace-me-with-your-jwt-access-token>'
```

Response OK

```json
{
  "userId": "1f3dd8da-b0ff-43a2-b58d-08de952b52d8",
  "firstname": "Admin",
  "lastname": "Administration",
  "username": "admin@gmail.com",
  "roles": [
    "ADMIN",
    "DEV"
  ]
}
```

Response KO

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

--------

- Get the connected user (`JWT token with role ADMIN required)`. The last guard [RolesGuard](/src/auth/roles.guard.ts)
  used with [@Roles](/src/auth/roles.decorator.ts))
  by specifying the required roles array:

```
  @Roles(role1, role2, ...)
  async myEndpoint()..
```

will check whether the current authenticated user has at last one of the required roles to let pass the request and
throw forbidden exception (403) otherwise.

Call:

```shell script
curl -X GET 'http://localhost:3000/users/connected' \
-H 'api-key: FTBStxXxvxVbjdNLpSgBdhkhbU' \
-H 'Authorization: Bearer eyJhbGciOiJIUzUxM'
```

Response for user with required role (ADMIN)

```json
[
  {
    "userId": "57e0d1de-ea51-4f4c-b4b1-860cdc993d4b",
    "roles": [
      "DEV"
    ],
    "createdDate": "2020-09-23T12:14:04.653Z",
    "connectionsCount": 1,
    "lastConnectionDate": "2020-09-23T13:56:10.879Z"
  },
  {
    "userId": "1f3dd8da-b0ff-43a2-b58d-08de952b52d8",
    "roles": [
      "ADMIN",
      "DEV"
    ],
    "createdDate": "2020-09-23T12:14:04.653Z",
    "connectionsCount": 23,
    "lastConnectionDate": "2020-09-23T13:56:32.420Z"
  }
]
```

Response for user without required role (DEV)

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## Stay in touch

- [Web site](https://idirnaitali.com)
- [Linkedin](https://www.linkedin.com/in/inaitali)
- [Github](https://github.com/idirnaitali)
- [Gitlab](https://gitlab.com/idirnaitali1)
- [Facebook](https://www.facebook.com/idir.naitali.1)
- [Twitter](https://twitter.com/NAITALIIdir2)
- [Instagram](https://www.instagram.com/idirnaiali)
