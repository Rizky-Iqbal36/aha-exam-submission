# AHA Exam Submission

## Server
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

  <p align="center">This project was built using <a href="https://nestjs.com/" target="_blank">Nest.js</a>, a <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>


### Description

This project is live 🚀 on: https://aha-exam-be.netlify.app <br />
Health-check: https://aha-exam-be.netlify.app/health <br />
APIs documentation: 
<a href="https://iqbaldev-api-doc.stoplight.io/docs/Graphql-test-API-spec/branches/main/ef19c8e9e2391-aha-exam-submission" target="_blank">ikbal-aha-api-doc</a> 

### Env Configurations

On this app there will be 4 valid node environment `NODE_ENV` mode:
| Value         | Description                                                         | ENV Var Prefix |
| :------------ | :-------------------------------------------------------------------| :--------------|
| development   | Environment for development purpose only                            | DEV            |
| test          | The environment that will be used when test command is executed     | TEST           |
| staging       | The copy environment of production                                  | STAGING        |
| production    | Environment to use when server is ready to be used by our final user| PROD           |

You can see list of available ENV var [here](./server/.env.example) <br />
Note: 
* This project will only use `development` and `production`
* Make sure to change the ENVs value with your own, E.g (Google, Sendgrid, etc)

### Database Connection
Database that used on this project is <b>MySQL</b> with the help of <a href="https://typeorm.io/" target="_blank">typeorm</a> 

* The app will use ENV variable with prefix based on the environment you setup
  * Available ENV variable:
      1. `${ENV_VAR_PREFIX}`_DB_NAME
      2. `${ENV_VAR_PREFIX}`_DB_USER
      3. `${ENV_VAR_PREFIX}`_DB_PASS
      4. `${ENV_VAR_PREFIX}`_DB_HOST
      5. `${ENV_VAR_PREFIX}`_DB_PORT

### Installation

Note: <br />

- Make sure you have docker installed on your computer to set MySQL server up and running on your local machine
- Or you can install MySQL i use on docker compose instead install it using docker

```bash
# Start MySQL
npm run start:containers

# Get env
cp .env.example .env

# Install node modules
npm install
```

### Running the app

```bash

# Development
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

### Tools
* Sendgrid, SMTP service to deliver email
* Netlify, Server hosting

### CORS
The app is enabling cors and only allow two origins which is:
* https://ikbal-aha-exam.netlify.app, Client Side
* https://iqbaldev-api-doc.stoplight.io, APIs documentation
