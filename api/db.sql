-- Main Database Creation. Create if not existed
CREATE DATABASE IF NOT EXISTS realDB;

-- Use the Database
USE realDB;

-- User Table Creation. Create if not existed
CREATE TABLE
    IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_logged_in TINYINT (1) DEFAULT 0,
        two_factor_secret VARCHAR(255) NULL,
        two_factor_enabled TINYINT (1) DEFAULT 0
    );

CREATE TABLE
    IF NOT EXISTS checks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        query TEXT NOT NULL,
        verdict VARCHAR(50) DEFAULT 'mixed',
        check_type VARCHAR(50) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
    );