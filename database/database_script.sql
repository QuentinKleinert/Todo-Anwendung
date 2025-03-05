CREATE DATABASE TodoApplication;

CREATE TABLE users (
    name VARCHAR(255) PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_name) REFERENCES users(name) ON DELETE CASCADE
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE todo_categories (
    todo_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (todo_id, category_id),
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
