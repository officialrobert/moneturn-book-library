
 

## Books Endpoints

### Fetch books by page

```http
GET /v1/books/list?page=1&limit=10
```

### Fetch book info by id

```http
GET /v1/books/{id}
```

### Search books match

```http
GET /v1/books/search?search={searchQuery}
```

### Update book info by id

```http
PUT /v1/books/{id}
```

### Delete book info by id

```http
DELETE /v1/books/{id}
```

### Insert new book

```http
POST /v1/books
```





## Author Endpoints

### Fetch author info by id

```http
GET /v1/authors/{id}
```

### Fetch author list by page

```http
GET /v1/authors/list?page=1&limit=10
```

### Insert new author

```http
POST /v1/authors
```

### Update author info by id

```http
PUT /v1/authors/{id}
```

### Delete author info by id

```http
DELETE /v1/authors/{id}
```

### Search authors match

```http
GET /v1/authors/search?search={searchQuery}
```


### We use Drizzle ORM for ORMs and migrations

For schema changes or migrations, please carefully follow the following steps:

```bash
npm run db:generate 
npm run db:migrate 
npm run db:push  # This will push the migrations to the connected database
```


### Server Operations Queue

Created a custom queue handler for run-time server operations. See file `src/lib/queue.ts` for more details.