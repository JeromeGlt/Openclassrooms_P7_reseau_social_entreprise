const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const PostCtrl = require('../controllers/post')

router.get('/', auth, PostCtrl.getAllPosts)
router.get('/post/:id', auth, PostCtrl.getOnePost)
router.post('/', auth, multer, PostCtrl.createPost)
router.put('/:id', auth, multer, PostCtrl.modifyPost)
router.delete('/:id', auth, PostCtrl.deletePost)

module.exports = router