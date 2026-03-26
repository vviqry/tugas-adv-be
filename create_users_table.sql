-- Jalankan script ini di MySQL Workbench / phpMyAdmin
-- Buat tabel users di database movie_db

USE movie_db;

CREATE TABLE IF NOT EXISTS users (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  fullname           VARCHAR(100) NOT NULL,
  username           VARCHAR(50)  NOT NULL UNIQUE,
  password           VARCHAR(255) NOT NULL,
  email              VARCHAR(100) NOT NULL UNIQUE,
  verification_token VARCHAR(255) DEFAULT NULL,
  is_verified        BOOLEAN      DEFAULT FALSE,
  created_at         TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
