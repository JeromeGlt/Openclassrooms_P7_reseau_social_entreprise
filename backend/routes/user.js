const express = require('express')
const router = express.Router()

const UserCtrl = require('../controllers/user')
const multer = require('../middleware/multer-config')
const rateLimiter = require('../middleware/rate-limit')
const auth = require('../middleware/auth')

router.post('/signup', rateLimiter, multer, UserCtrl.signup)
router.post('/login', rateLimiter, UserCtrl.login)
router.delete('/profile/delete/:pseudo', auth, UserCtrl.delete)
router.put('/profile/:id', auth, multer, UserCtrl.modifyProfile)

module.exports = router