const express =require('express')
const { signIn, signUp, saveDetectionData } = require('../controllers/farmer')

const router = express.Router()

router.post('/signIn', signIn)
router.post('/signUp', signUp)
router.post('/saveDetectionData',saveDetectionData)

module.exports = router