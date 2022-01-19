const express = require('express')
const router = express.Router()

const RefreshCtrl = require('../controllers/refresh')

router.get('/', RefreshCtrl.getUserDatas)
router.get('/:user_id', RefreshCtrl.getUserPseudo)

module.exports = router