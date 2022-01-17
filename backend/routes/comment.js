const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const CommentCtrl = require('../controllers/comment')

// router.get('/comments', auth, CommentCtrl.getAllComments)
router.post('/comments', auth, multer, CommentCtrl.createComment)
router.put('/comments/:id', auth, multer, CommentCtrl.modifyComment)
router.delete('/comments/:id', auth, CommentCtrl.deleteComment)

module.exports = router