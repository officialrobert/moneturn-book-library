# Book Library API

This project demonstrates how to build a book library API using `Fastify`, `TypeScript`, `Drizzle ORM` paired with `PostgreSQL` database.

![ScreenRec_2025-06-05 05-04-08](https://github.com/user-attachments/assets/1c85f8ea-96ae-41ac-9610-4a140b178911)



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

## Server environment variables

```bash
PORT=3001

# postgres docker
POSTGRES_USER="book_library_user_postgres"
POSTGRES_PASSWORD="book_library_password_postgres"
POSTGRES_DB="book_library"
POSTGRES_HOST="book_library_postgres"
POSTGRES_PORT="5432"

DATABASE_URL='postgresql://book_library_user_postgres:book_library_password_postgres@localhost:5432/book_library'
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




## Links

Link to the server API docs: [Server API](./book-library-server/README.md)

Link to the client app docs: [Client App](./book-library-alpha/README.md)
