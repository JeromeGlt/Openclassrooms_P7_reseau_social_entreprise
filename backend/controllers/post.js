const Post = require('../models/post')
const Comment = require('../models/comment')
const Like = require('../models/like')
const User = require('../models/user')
const fs = require('fs')

exports.getAllPosts = (req, res, next) => {
    Post.findAll({ include : [Comment, Like, User] })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }))
}

exports.createPost = (req, res, next) => {
    const postObject = {...req.body}
    console.log(req.body)

    const post = Post.create({
        ...postObject,
        likes: 0,
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
        user_id: +req.body.userId
    })
        .then(post => {
            res.status(201).json({ post })
        })
        .catch(() => res.status(500).json({ message : 'erreur dans la création du post' }))
}

exports.modifyPost = (req, res, next) => {
    console.log(req.body)
    const postObject = req.file ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body,
        imageUrl: null
    }
    Post.update({ ...postObject }, { where :  { id : req.params.id }})
        .then(() => res.status(200).json({ message : 'Post modifié' }))
        .catch(() => res.status(500).json({ message : 'Erreur dans update' }))
}

exports.deletePost = (req, res, next) => {
    console.log(req.params.id)
    Post.findOne({ where : { id : req.params.id }})
        .then(post => {
            if(req.file) {
                const filename = post.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Post.destroy({ where : { id : req.params.id }})
                        .then(() => res.status(200).json({ message : 'Post supprimé !' }))
                        .catch(() => res.status(500).json({ message : 'Suppression impossible' }))
                })
            } else {
                Post.destroy({ where : { id : req.params.id }})
                    .then(() => res.status(200).json({ message : 'Post supprimé !' }))
                    .catch(() => res.status(500).json({ message : 'Suppression impossible' }))
            }
        })
        .catch((e) => res.status(500).json(e))
}