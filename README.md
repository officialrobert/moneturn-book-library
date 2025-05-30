# Book Library API

This project demonstrates how to build a book library API using `Fastify`, `TypeScript`, `Drizzle ORM` paired with `PostgreSQL` database.


## Prerequisites


> Docker engine

You must have Docker engine installed on your machine to run the PostgreSQL database.


> Node.js

You must have Node.js installed on your machine to run the server app. Version tested against is `v20.9.0`. We recommend using `nvm` to manage your Node.js versions.


Make sure you install all the necessary dependencies before running the project.

You must navigate to both projects `book-library-server` and `book-library-alpha` directories to install the dependencies.

```bash
npm install
``` 



## Running the PostgresSQL Database

**Make sure the Docker engine is running before running the following commands**

You must navigate to the `book-library-server` directory to run the PostgreSQL database.

To run the PostgreSQL database, you can use the following command:

```bash
docker compose -f docker-compose.db.yml up -d
```

or

```bash
npm run docker:db:up
```


## Initialize the Database schema from your local machine

Navigate to the `book-library-server` directory and run

```bash
npm run db:generate
npm run db:migrate
```


## Running the server app

> First Option

Run from the root directory

```bash
npm run dev:server
```

> Second Option

Navigate to the `book-library-server` directory and run

```bash
npm run dev
```


## Running the client app

> First Option

Run from the root directory

```bash
npm run dev:client
```

> Second Option

Navigate to the `book-library-alpha` directory and run

```bash
npm run dev
```