CREATE DATABASE fast_food_website;

USE fast_food_website;

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    birthdate DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Menu_Items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(5, 2),
    category VARCHAR(50),
    image_url VARCHAR(255)
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    employee_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(7, 2),
    status VARCHAR(50)
);

CREATE TABLE Order_Details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    item_id INT,
    quantity INT,
    price DECIMAL(5, 2)
);

CREATE TABLE Employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    phone_number VARCHAR(15),
    email VARCHAR(100),
    hire_date DATE
);
ALTER TABLE Orders ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(user_id);

ALTER TABLE Orders ADD CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES Employees(employee_id);

ALTER TABLE Order_Details ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES Orders(order_id);

ALTER TABLE Order_Details ADD CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id);
