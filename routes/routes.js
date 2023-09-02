const router = require('express').Router()
const UserController = require('../controller/test_controller')

router.post('/post', UserController.register)
router.post('/login', UserController.login)   //SHA256 encrypted password passed from the front-end to the backend
router.post('/getData', UserController.getData)
router.put('/updateBudget', UserController.updateMonthlyBudget)
router.put('/updateExpense', UserController.updateExpense)

module.exports = router;