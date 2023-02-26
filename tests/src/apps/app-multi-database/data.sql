CREATE TABLE users (id  serial PRIMARY KEY, firstName VARCHAR(100) NOT NULL, lastName VARCHAR(50) NOT NULL);
CREATE TABLE posts (id  serial PRIMARY KEY, title VARCHAR(100) NOT NULL, description TEXT NOT NULL);
