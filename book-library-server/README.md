

## Endpoints


### Fetch books by page

```http
GET /v1/books/list?page=1&limit=10
```

### Fetch book info by id

```http
GET /v1/books/{id}
```


### We use Drizzle ORM for ORMs and migrations

For schema changes or migrations, please carefully follow the following steps:

```bash
npm run db:generate 
npm run db:migrate 
npm run db:push  # This will push the migrations to the connected database
```