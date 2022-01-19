const Comment = require('../models/comment')
const fs = require('fs')
const User = require('../models/user')

// exports.getAllComments = (req, res, next) => {
//     Comment.findAll({ include : User })
//         .then(comments => res.status(200).json(comments))
//         .catch(error => res.status(500).json({ error }))
// }

exports.createComment = (req, res, next) => {
    console.log(req.body)

    if(req.body.text === 'undefined') {
        req.body.text = null
    }

    const comment = Comment.create({
        text: req.body.text,
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
        user_id: +req.body.userId,
        post_id: +req.body.postId
    })
        .then(comment => {
            res.status(201).json({ comment })
        })
        .catch(() => res.status(500).json({ message : 'erreur dans la création du commentaire' }))
}

exports.modifyComment = (req, res, next) => {
    console.log(req.body)

    if(req.body.text === 'undefined') {
        req.body.text = null
    }

    const commentObject = req.file ? {
        text: req.body.text,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        text: req.body.text,
        imageUrl: null
    }
        Comment.update({ ...commentObject }, { where : { id : req.params.id }})
            .then(() => res.status(200).json({ message : 'Commentaire modifié' }))
            .catch(() => res.status(500).json({ message : 'Erreur dans update' }))
}

exports.deleteComment = (req, res, next) => {
    console.log(req.params.id)
    Comment.findOne({ where : { id : req.params.id }})
        .then(comment => {
            if(req.file) {
                const filename = comment.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Comment.destroy({ where : { id : req.params.id }})
                        .then(() => res.status(200).json({ message : 'Commentaire supprimé !' }))
                        .catch(() => res.status(500).json({ message : 'Suppression impossible' }))
                })
            } else {
                Comment.destroy({ where : { id : req.params.id }})
                    .then(() => res.status(200).json({ message : 'Commentaire supprimé !' }))
                    .catch(() => res.status(500).json({ message : 'Suppression impossible' }))
            }
        })
        .catch(error => res.status(500).json({ error }))
}