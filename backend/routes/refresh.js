const express = require('express')
const router = express.Router()

const RefreshCtrl = require('../controllers/refresh')

router.get('/', RefreshCtrl.getUserDatas)
// router.get('/profile', RefreshCtrl.getUserDatas)

module.exports = router