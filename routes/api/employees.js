const express = require('express')
const router = express.Router()
const employeesController = require('../../controllers/employeesController')
const {verifyJwt} = require('../../middleware/verifyJwt')
router.route('/')
    .get(verifyJwt, employeesController.getAllEmployees)
    .post(verifyJwt, employeesController.createNewEmployee)
    .put(verifyJwt, employeesController.updateEmployee)
    .delete(verifyJwt, employeesController.deleteEmployee)

router.route('/:id')
    .get(verifyJwt, employeesController.getEmployee)

module.exports = router