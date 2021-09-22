DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary decimal NOT NULL,
    departments_id INT NOT NULL,
    FOREIGN KEY (departments_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INT DEFAULT NULL,
    manager_id INT DEFAULT NULL,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (roles_id) REFERENCES roles(id) ON DELETE SET NULL
);


