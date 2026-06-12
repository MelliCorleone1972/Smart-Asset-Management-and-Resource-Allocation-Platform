CREATE DATABASE IF NOT EXISTS cult_asset_management;

CREATE USER IF NOT EXISTS 'cult_admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON cult_asset_management.* TO 'cult_admin'@'localhost';
FLUSH PRIVILEGES;

USE cult_asset_management;

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'consumer') DEFAULT 'consumer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  total_quantity INT NOT NULL,
  available_quantity INT NOT NULL,
  health_status ENUM('excellent', 'good', 'needs_repair') DEFAULT 'good',
  FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  asset_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  start_date DATETIME NOT NULL,
  due_date DATETIME NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'issued', 'returned', 'overdue') DEFAULT 'pending',
  actual_return_date DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES Assets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Audit_Logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);