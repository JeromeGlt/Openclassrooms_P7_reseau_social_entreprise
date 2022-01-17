const express = require('express')
const router = express.Router()

const UserCtrl = require('../controllers/user')
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.post('/signup', multer, UserCtrl.signup)
router.post('/login', UserCtrl.login)
router.delete('/profile/delete/:pseudo', auth, UserCtrl.delete)
router.get('/profile/:id', auth, UserCtrl.getProfile)
router.put('/profile/:id', auth, multer, UserCtrl.modifyProfile)

module.exports = router