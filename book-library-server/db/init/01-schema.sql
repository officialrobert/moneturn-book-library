-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13),
    published_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create borrowing_records table
CREATE TABLE IF NOT EXISTS borrowing_records (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id),
    user_id INTEGER REFERENCES users(id),
    borrowed_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned'))
);