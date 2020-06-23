const { prompt } = require("inquirer")
const db = require("./db")
require("console.table")

init()
function init() {
    loadMainPrompts()
}

async function loadMainPrompts() {
    const { choice } = await prompt ([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View Employees by Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "View Roles"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ])

    switch (choice) {
        case "VIEW_EMPLOYEES":
          return viewEmployees();
        case "VIEW_EMPLOYEES_BY_DEPARTMENT":
          return viewEmployeesByDepartment();
        case "VIEW_EMPLOYEES_BY_MANAGER":
          return viewEmployeesByManager();
        case "ADD_EMPLOYEE":
          return addEmployee();
        case "REMOVE_EMPLOYEE":
          return removeEmployee();
        case "UPDATE_EMPLOYEE_ROLE":
          return updateEmployeeRole();
        case "UPDATE_EMPLOYEE_MANAGER":
          return updateEmployeeManager();
        case "VIEW_DEPARTMENTS":
          return viewDepartments();
        case "ADD_DEPARTMENT":
          return addDepartment();
        case "REMOVE_DEPARTMENT":
          return removeDepartment();
        case "VIEW_ROLES":
          return viewRoles();
        case "ADD_ROLE":
          return addRole();
        case "REMOVE_ROLE":
          return removeRole();
        default:
          return quit();
    }

}

async function viewEmployees() {
    const employees = await db.findAllEmployees();

    console.table(employees)

    loadMainPrompts()
}

async function viewEmployeesByDepartment() {
    const departments = await db.findAllDepartments()

    const departmentSelection = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }))
    
    const { departmentId } = await prompt ([
        {
            type: "list",
            name: "department Id",
            message: "Select the department",
            choices: departmentSelection
        }
    ])
    
    const employees = await db.findAllEmployeesByDepartment(departmentId)

    console.table(employees)

    loadMainPrompts()
}

async function viewEmployeesByManager() {
    const managers = await db.findAllEmployees()

    const managerSelection = managers.map(({ id,firstName, lastName}) => ({
        name: `${firstName} ${lastName}`,
        value: id
    }))

    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee do you want to see the direct reports for?",
            choices: managerSelection
        }
    ])
    
    const employees = await db.findAllEmployeesManager(managerId)

    if(employees.length === 0) {
        console.log("The selected employee has no direct report")
    } else {
        console.table(employees)
    }
    loadMainPrompts()
}

async function removeEmployee() {
    const employees = await db.findAllEmployees()

    const employeeSelection = employees.map (({ id, firstName, lastName}) => ({
        name: `${firstName} ${lastName}`,
        value: id
    }))

    const { employeeId }  = await prompt ([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee od you want to remove?",
            choices: employeeSelection
        }
    ])

    await db.removeEmployee(employeeId)
    console.log("Employee has been removed from the database")

    loadMainPrompts()
}

async function updateEmployeeRole() {
    const employees = await db.findAllEmployees()

    const employeeSelection = employees.map (({ id, firstName, lastName}) => ({
        name: `${firstName} ${lastName}`,
        value: id    
    }))

    const { employeeId } = await prompt ([
        {
            type: "list",
            name: "employeeId",
            message: "Select the employee's role you'd like to update?",
            choices: employeeSelection
        }
    ])

    const roles = await db.findAllRoles()
    
    const roleSelection = roles.map (({ id, title}) =>({
        name: title,
        value: id
    }))

    const { roleId } = await prompt ([
        {
            type: "list",
            name: "roleId",
            message: "Which role do you want to assign the selected employee?",
            choices: roleSelection
        }
    ])
    await db.updateEmployeeRole( employeeId, roleId)

    console.log("Employee's Role Updated")
    loadMainPrompts()
}

async function updateEmployeeManager() {
    const employees = await db.findAllEmployees()

    const employeeSelection = employees.map(({ id, firstName, lastName}) =>({
        name: `${firstName} ${lastName}`,
        value: id
    }))

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which manager do you want to update?",
            choices: employeeSelection
        }
    ])

    const managers = await db.findAllPossibleManagers(employeeId)

    const managerSelection = managers.map(({ id, firstName, lastName}) => ({
        name: `${firstName} ${lastName}`,
        value: id
    }))

    const { managerId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to set as manager for the selected employee?",
            choices: managerSelection
        }
    ])

    await db.updateEmployeeManager( employeeId, managerId )
    console.log("Employee's Manager's Updated")
    loadMainPrompts()
}

async function viewRoles() {
    const roles = await db.findAllRoles()
    console.table(roles)
    loadMainPrompts()
}

async function addRole() {
    const departments = await db.findAllDepartments()
    
    const departmentSelection = departments.map (({ id, name }) => ({
        name: name,
        value: id
    }))

    const role = await prompt([
        {
            name: "title",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentSelection
        }
    ])
    await db.createRole(role)
    console.log(`Added ${role.title} to the database`)
    loadMainPrompts()
}

async function removeRole() {
    const roles = await db.findAllRoles()

    const roleSelection = roles.map (({ id, title }) => ({
        name: title,
        value: id
    }))
    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "which role doy ou want to remove?",
            choices: roleSelection
        }
    ])

    await db.removeRole(roleId)
    console.log("Role has been removed from database")
    loadMainPrompts()
}

async function viewDepartments() {
    departments = await db.findAllDepartments()
    console.table(departments)
    loadMainPrompts()
}

async function addDepartment() {
    const department = await prompt([
        {
            name: "name",
            message: "What's the name of the department?"
        }
    ])
    
    await db.createDepartment(department)
    console.log(`${department.name} has been added to database`)
    loadMainPrompts()
}

async function removeDepartment() {
    const departments = await db.findAllDepartments()

    const departmentSelection = departments.map(({ id, name}) =>({
        name: name,
        value: id
    }))

    const { departmentId } = await prompt({
        type: "list",
        name: "departmentId",
        message:
          "Which department would you like to remove?",
        choices: departmentSepection
    })

    await db.removeDepartment(departmentId)
    console.log(`${department.name} has been removed from the database`)
    loadMainPrompts()
}

async function addEmplooyee() {
    const roles = await db.findAllRoles()
    const employees = await db.findAllEmployees()

    const employee = await prompt([
        {
            name: "firstName",
            message: "What's the employee's first name?"
        },
        {
            name: "lastName",
            message: "what is the employee's last name?"
        }
    ])
    
    const roleSelection = roles.map(({ id, title }) => ({
        name: title,
        value: id   
    }))

    const { roleId } = await prompt ({
        type: "list",
        name: "roleId",
        message: "What is teh employee's role?",
        choices: roleSelection 
    }) 

    employee.role_id = roleId

    const managerSelection = employees.map(({ id, firstName, lastName}) =>({
        name: `${firstName} ${lastName}`,
        value: id
    }))
    
    managerSelection.unshift({ name: "None", value: null })

    const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: managerSelection
    })

    employee.manager_id = managerId

    await db.createEmployee(employee)

    console.log(`${employee.firstName} ${employee.lastName} added to the database`)
    
    loadMainPrompts()
}

function quit() {
    process.exit()
}

















