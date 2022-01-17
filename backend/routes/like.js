const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const LikeCtrl = require('../controllers/like')

router.post('/likes', auth, LikeCtrl.createLike)
router.delete('/:post_id/:user_id/likes', auth, LikeCtrl.deleteLike)
// router.get('/likes', auth, LikeCtrl.getLike)

module.exports = router