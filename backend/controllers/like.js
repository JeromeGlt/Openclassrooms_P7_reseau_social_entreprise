const Like = require('../models/like')

exports.createLike = (req, res, next) => {
    console.log(req.body)
    const likeObject = req.body
    const like = Like.create({
        ...likeObject
    })
    .then(like => {
        res.status(201).json({ like })
    })
        .catch((error) => res.status(500).json({ error }))
}

exports.deleteLike = (req, res, next) => {
    Like.destroy({ where : { post_id : req.params.post_id, user_id : req.params.user_id }})
        .then(() => res.status(200).json({ message : 'Like supprimé' }))
        .catch(() => res.status(500).json({ message : 'Suppression impossible' }))
}

// exports.getLike = (req, res, next) => {
//     Like.findAll()
//         .then(likes => res.status(200).json(likes))
//         .catch(error => res.status(500).json({ error }))
// }