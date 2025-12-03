const express = require('express')
const { getSensorData } = require('../controllers/iot')

const router = express.Router()

router.get('/getIoTData',getSensorData)

module.exports = router