INSERT INTO departments (name)
VALUES 
('Research and Development'),
('Human Resources'),
('Billing'),
('Sales and Business Development'),
('Management'),
('Marketing');

INSERT INTO roles (title, salary, departments_id)
VALUES 
('Manager', 250000, 5),
('Head of HR', 80000, 2),
('Sales Consultant', 140000, 4);

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES 
    ('James', 'Blake', 1, null),
    ('Broil', 'Steakman', 2, 1),
    ('Mac', 'Clowney', 3, 1);
