const express =require('express')
const { signIn, signUp, saveDetectionData,getPreviousDetections } = require('../controllers/farmer')

const router = express.Router()

router.post('/signIn', signIn)
router.post('/signUp', signUp)
router.post('/saveDetectionData',saveDetectionData)
router.get('/previousDetection/:farmerId',getPreviousDetections)

module.exports = router