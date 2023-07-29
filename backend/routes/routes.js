const router = require('express').Router()
const UserController = require('../controller/test_controller')

router.post('/post', UserController.register)   

module.exports = router;