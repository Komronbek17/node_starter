const data = {
    employees: require('../model/employees.json'),
    setEmployees(updateEmployees) {
        this.employees = updateEmployees
    },
    addEmployees(newEmployee) {
        this.employees.push(newEmployee)
    }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const createNewEmployee = (req, res) => {
    const lastId = data.employees[data.employees.length - 1].id + 1 || 1
    const newEmployee = {
        id: lastId,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if (!(newEmployee.firstname || newEmployee.lastname)) {
        res.status(400).json({
            "message": "First and Last names are required"
        })
    }

    data.addEmployees(newEmployee)
    res.status(201).json(data.employees)
}

const updateEmployee = (req, res) => {
    const empIndex = data.employees.findIndex(emp => emp.id === parseInt(req.body.id))
    if (empIndex === -1) {
        res.status(400).json({
            "message": `Employee ID ${req.body.id} not found`,
        })
    } else {
        data.employees[empIndex].firstname = req.body.firstname
        data.employees[empIndex].lastname = req.body.lastname
        res.json(data.employees)
    }
}

const deleteEmployee = (req, res) => {
    const empIndex = data.employees.findIndex(emp => emp.id === parseInt(req.body.id))
    if (empIndex === -1) {
        res.status(400).json({
            "message": `Employee ID ${req.body.id} not found`
        })
    } else {
        const {id: removingId} = data.employees[empIndex]
        data.employees = data.employees.filter(emp => emp.id !== removingId)
        res.json(data.employees)
    }
}

const getEmployee = (req, res) => {
    const empIndex = data.employees.findIndex(emp => emp.id === parseInt(req.params.id))
    if (empIndex === -1) {
        res.status(400).json({
            "message": `Employee ID ${req.body.id} not found`
        })
    } else {
        res.json(data.employees[empIndex])
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}