const db = require('./db/connection');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

const log = console.log; // Shortcut for writing out console.log everytime

db.connect(err => {
  if (err) throw err;
    log(chalk.red.bold(`====================================================================================`));
    log(``);
    log(chalk.redBright.bold(figlet.textSync('Employee Tracker')));
    log(``);
    log(``);
    log(``);
    log(chalk.red.bold(`====================================================================================`));
    promptUser();

    log(' Database connected.');
});

// Prompt User for Choices
const promptUser = () => {
  inquirer.prompt([
      {
        name: 'choices',
        type: 'list',
        message: 'Please select an option:',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'View All Employees By Department',
          'View Department Budgets',
          'Update Employee Role',
          'Update Employee Manager',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Remove Employee',
          'Remove Role',
          'Remove Department',
          'Exit'
          ]
      }
  ])
    .then((answers) => {
      const {choices} = answers;

      if (choices === 'View All Departments') {
        viewAllDepartments();
      }

      if (choices === 'View All Roles') {
        viewAllRoles();
      }

      if (choices === 'View All Employees') {
        viewAllEmployees();
      }

      if (choices === 'View All Employees By Department') {
        viewEmployeesByDepartment();
      }

      if (choices === 'Add Employee') {
        addEmployee();
      }

      if (choices === 'Remove Employee') {
        removeEmployee();
      }

      if (choices === 'Update Employee Role') {
        updateEmployeeRole();
      }

      if (choices === 'Update Employee Manager') {
        updateEmployeeManager();
      }

      if (choices === 'Add Role') {
        addRole();
      }

      if (choices === 'Remove Role') {
        removeRole();
      }

      if (choices === 'Add Department') {
        addDepartment();
      }

      if (choices === 'View Department Budgets') {
        viewDepartmentBudget();
      }

      if (choices === 'Remove Department') {
        removeDepartment();
      }

      if (choices === 'Exit') {
        db.end();
      }
  });
};

// View all Departments
const viewAllDepartments = () => {
  const sql = `SELECT departments.id AS id, departments.name AS departments FROM departments`; 
  db.query(sql, (error, response) => {
    if (error) throw error;
    log(chalk.yellow.bold(`==================================================================================`));
    log(`                              ` + chalk.green.bold(`All Departments:`));
    log(chalk.yellow.bold(`==================================================================================`));
    console.table(response);
    log(chalk.yellow.bold(`==================================================================================`));
    promptUser();
  });
};

// View all Roles
const viewAllRoles = () => {
  const sql = `SELECT roles.id, roles.title, departments.name AS departments
  FROM roles INNER JOIN departments ON roles.departments_id = departments.id`;

  log(chalk.yellow.bold(`===================================================================================`));
  log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
  log(chalk.yellow.bold(`===================================================================================`));
  db.query(sql, (error, response) => {
    if (error) throw error;
      console.table(response.forEach((roles) => {log(roles.title);}));
      log(chalk.yellow.bold(`==================================================================================`));
      promptUser();
  });
};

const viewAllEmployees = () => {
  let sql = `SELECT employees.id, 
            employees.first_name AS 'First Name', 
            employees.last_name AS 'Last Name', 
            roles.title AS 'Title',
            manager_id, 
            departments.name AS 'Departments', 
            roles.salary
            FROM employees, roles, departments 
            WHERE departments.id = roles.departments_id 
            AND roles.id = employees.roles_id
            ORDER BY employees.id ASC`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    log(chalk.yellow.bold(`====================================================================================`));
    log(`                              ` + chalk.green.bold(`Current Employees:`));
    log(chalk.yellow.bold(`====================================================================================`));
    console.table(response);
    log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};

// View all Employees by Department
const viewEmployeesByDepartment = () => {
  const sql = `SELECT employees.first_name AS 'First Name', 
              employees.last_name AS 'Last Name', 
              departments.name AS 'Departments'
              FROM employees 
              LEFT JOIN roles ON employees.roles_id = roles.id 
              LEFT JOIN departments ON roles.departments_id = departments.id`;
  db.query(sql, (error, response) => {
    if (error) throw error;
      log(chalk.yellow.bold(`====================================================================================`));
      log(`                              ` + chalk.green.bold(`Employees by Department:`));
      log(chalk.yellow.bold(`====================================================================================`));
      console.table(response);
      log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
    });
};

//View all Departments by Budget
const viewDepartmentBudget = () => {
  const sql = `SELECT departments_id AS id, 
  departments.name AS departments,
  SUM(salary) AS budget
  FROM roles  
  INNER JOIN departments ON roles.departments_id = departments.id GROUP BY roles.departments_id`;
  log(chalk.yellow.bold(`====================================================================================`));
  log(`                              ` + chalk.green.bold(`Budget By Department:`));
  log(chalk.yellow.bold(`====================================================================================`));
  db.query(sql, (error, response) => {
    if (error) throw error;
      console.table(response);
      log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
  });
};

// NEWLY ADDED

// Add a New Department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
      }
    ])
    .then((answer) => {
      let sql = `INSERT INTO departments (name) VALUES (?)`;
      db.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        log(``);
        log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
        log(``);
        viewAllDepartments();
      });
    });
};

// Add a New Role
const addRole = () => {
  const sql = 'SELECT * FROM departments'
  db.query(sql, (error, response) => {
      if (error) throw error;
      let deptNamesArray = [];
      response.forEach((departments) => {deptNamesArray.push(departments.name);});
      deptNamesArray.push('Create Department');
      inquirer
        .prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: deptNamesArray
          }
        ])
        .then((answer) => {
          if (answer.departmentName === 'Create Department') {
            this.addDepartment();
          } else {
            addRoleInfo(answer);
          }
        });

      const addRoleInfo = (departmentData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of the role?'
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?'
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            response.forEach((departments) => {
              if (departmentData.departmentName === departments.name) {departmentId = departments.id;}
            });

            let sql =   `INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)`;
            let roleInfo = [createdRole, answer.salary, departmentId];

            db.query(sql, roleInfo, (error) => {
              if (error) throw error;
              log(chalk.yellow.bold(`====================================================================================`));
              log(chalk.greenBright(`Role successfully created!`));
              log(chalk.yellow.bold(`====================================================================================`));
              viewAllRoles();
            });
          });
      };
    });
  };

// Add a New Employee
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const employeeInfo = [answer.firstName, answer.lastName]
    const roleSql = `SELECT roles.id, roles.title FROM roles`;
    db.query(roleSql, (error, data) => {
      if (error) throw error; 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              employeeInfo.push(role);
              const managerSql =  `SELECT * FROM employees`;
              db.query(managerSql, (error, data) => {
                if (error) throw error;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    employeeInfo.push(manager);
                    const sql =   `INSERT INTO employees (first_name, last_name, roles_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                    db.query(sql, employeeInfo, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")
                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
};

// UPDATE company Info

// Update an Employee's Role
const updateEmployeeRole = () => {
  let sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.id AS "roles_id"
                  FROM employees, roles, departments WHERE departments.id = roles.departments_id AND roles.id = employees.roles_id`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employees) => {employeeNamesArray.push(`${employees.first_name} ${employees.last_name}`);});

    let sql = `SELECT roles.id, roles.title FROM roles`;
    db.query(sql, (error, response) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((roles) => {rolesArray.push(roles.title);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new role?',
            choices: employeeNamesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'What is their new role?',
            choices: rolesArray
          }
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((roles) => {
            if (answer.chosenRole === roles.title) {
              newTitleId = roles.id;
            }
          });

          response.forEach((employees) => {
            if ( answer.chosenEmployee === `${employees.first_name} ${employees.last_name}`) {
            employeeId = employees.id;
          }
          });

          let sqls = `UPDATE employees SET employees.roles_id = ? WHERE employees.id = ?`;
          db.query( sqls, [newTitleId, employeeId], (error) => {
              if (error) throw error;
              console.log(chalk.greenBright.bold(`====================================================================================`));
              console.log(chalk.greenBright(`Employee Role Updated`));
              console.log(chalk.greenBright.bold(`====================================================================================`));
              promptUser();
            }
          );
        });
    });
  });
};

// Update an Employee's Manager
const updateEmployeeManager = () => {
  let sql = `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id
                  FROM employees`;
   db.query(sql, (error, response) => {
    let employeeNamesArray = [];
    response.forEach((employees) => {employeeNamesArray.push(`${employees.first_name} ${employees.last_name}`);});

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee has a new manager?',
          choices: employeeNamesArray
        },
        {
          name: 'newManager',
          type: 'list',
          message: 'Who is their manager?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId, managerId;
        response.forEach((employees) => {
          if (
            answer.chosenEmployee === `${employees.first_name} ${employees.last_name}`
          ) {
            employeeId = employees.id;
          }
          if (
            answer.newManager === `${employees.first_name} ${employees.last_name}`
          ) {
            managerId = employees.id;
          }
        });

        if (answer.chosenEmployee, answer.newManager) {
          log(chalk.redBright.bold(`====================================================================================`));
          log(chalk.redBright(`Invalid Manager Selection`));
          log(chalk.redBright.bold(`====================================================================================`));
          promptUser();
        } else {
          let sql = `UPDATE employees SET employees.manager_id = ? WHERE employees.id = ?`;

          db.query(sql, [managerId, employeeId], (error) => {
              if (error) throw error;
              log(chalk.greenBright.bold(`====================================================================================`));
              log(chalk.greenBright(`Employee Manager Updated`));
              log(chalk.greenBright.bold(`====================================================================================`));
              promptUser();
            }
          );
        };
      });
  });
};

//  REMOVE Company Data

// Delete an Employee
const removeEmployee = () => {
  let sql = `SELECT employees.id, employees.first_name, employees.last_name FROM employees`;

  db.query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employees) => {employeeNamesArray.push(`${employees.first_name} ${employees.last_name}`);});

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee would you like to remove?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId;

        response.forEach((employees) => {
          if (
            answer.chosenEmployee ===
            `${employees.first_name} ${employees.last_name}`
          ) {
            employeeId = employees.id;
          }
        });

        let sql = `DELETE FROM employees WHERE employees.id = ?`;
        db.query(sql, [employeeId], (error) => {
          if (error) throw error;
          log(chalk.redBright.bold(`====================================================================================`));
          log(chalk.redBright(`Employee Successfully Removed`));
          log(chalk.redBright.bold(`====================================================================================`));
          viewAllEmployees();
        });
      });
  });
};

// Delete a Role
const removeRole = () => {
  let sql = `SELECT roles.id, roles.title FROM roles`;

  db.query(sql, (error, response) => {
    if (error) throw error;
    let roleNamesArray = [];
    response.forEach((roles) => {roleNamesArray.push(roles.title);});

    inquirer
      .prompt([
        {
          name: 'chosenRole',
          type: 'list',
          message: 'Which role would you like to remove?',
          choices: roleNamesArray
        }
      ])
      .then((answer) => {
        let roleId;

        response.forEach((roles) => {
          if (answer.chosenRole === roles.title) {
            roleId = roles.id;
          }
        });

        let sql = `DELETE FROM roles WHERE roles.id = ?`;
        db.query(sql, [roleId], (error) => {
          if (error) throw error;
          log(chalk.redBright.bold(`====================================================================================`));
          log(chalk.greenBright(`Role Successfully Removed`));
          log(chalk.redBright.bold(`====================================================================================`));
          viewAllRoles();
        });
      });
  });
};

// Delete a Department
const removeDepartment = () => {
  let sql = `SELECT departments.id, departments.name FROM departments`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    let departmentNamesArray = [];
    response.forEach((departments) => {departmentNamesArray.push(departments.name);});

    inquirer
      .prompt([
        {
          name: 'chosenDept',
          type: 'list',
          message: 'Which department would you like to remove?',
          choices: departmentNamesArray
        }
      ])
      .then((answer) => {
        let departmentId;

        response.forEach((departments) => {
          if (answer.chosenDept === departments.name) {
            departmentId = departments.id;
          }
        });

        let sql = `DELETE FROM departments WHERE departments.id = ?`;
        db.query(sql, [departmentId], (error) => {
          if (error) throw error;
          log(chalk.redBright.bold(`====================================================================================`));
          log(chalk.redBright(`Department Successfully Removed`));
          log(chalk.redBright.bold(`====================================================================================`));
          viewAllDepartments();
        });
      });
  });
};

  /*
  We have to create a list of choces using the inquirer module. 
  After doing this you have to create a function and plug in the object
  as an argument because we need the data from the response. We will then link the response to 
  the data table module to display the data as a table to the console. 

  The user can then ask to see each table for employees departments and specific roles.
  They can also create a a new employee and or role as well as update and advise the employee and role fields.

  We have to then link this user input into an existing table if its altered information that was already created
  or create a brand new table for new information.

  To do this we would have to create prompts then in the function that we create we would link the sql we want created depending 
  on what the user input is.
  */