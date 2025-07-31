const express = require('express')
const { signIn, signUp } = require('../controllers/admin')

const router = express.Router()

router.get('/signIn',signIn)
router.post('/signUp',signUp)

module.exports = router