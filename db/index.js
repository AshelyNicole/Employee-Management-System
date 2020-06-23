const connection = require("./connection")

class DB {
    constructor(connection) {
        this.connection = connection 
    }
    
    findAllEmployees() {
        return this.connection.query(
            "SELECT employee.id, employee.firstName, employee.lastName, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        )
    }
    
    findAllPossibleManagers(employeeId) {
        return this.connection.query(
            "SELECT id, firstName, lastName FROM employee WHERE id != ?",
            employeeId
        )
    }

    createEmployee(employee) {
        return this.connection.query(
            "INSERT INTO employee SET?",
            employee
        )
    }

    removeEmployee(employeeId) {
        return this.connection.query(
            "DELETE FROM employee WHERE id = ?",
            employeeId
        )
    }

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            "UPDATE employee SET manager_id = ? WHERE id = ?",
            [managerId, employeeId]
        )
    }

    updateEmployeeManager(employeeId, managerId) {
        return this.connection.query(
            "UPDATE employee SET manager_id = ? WHERE id = ?",
            [managerId, employeeId]
        )
    }

    findAllRoles() {
        return this.connection.query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        )
    }

    createRole(role) {
        return this.connection.query("INSERT INTO role SET ?", role)
    }

    removeRole(roleId) {
        return this.connection.query("DELETE FROM role WHERE id = ?", roleId)
    }
    
    findAllDepartments() {
        return this.connection.query(
          "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
        )
    }

    createDepartment(department) {
        return this.connection.query(
            "INSERT INTO department SET ?",
            department
        )
    }

    removeDepartment(departmentId) {
        return this.connection.query(
            "DELETE FROM department WHERE ID = ?",
            departmentId
        )
    }

    findAllEmployeesByDepartment(departmentId) {
        return this.connection.query(
            "SELECT employee.id, employee.firstName, employee.lastName, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
            departmentId
        )
    }

    findAllEmployeesByManager(managerId) {
        return this.connection.query(
            "SELECT employee.id, employee.firstName, employee.lastName, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
            managerId
        )
    }
}

module.exports = new DB(connection);