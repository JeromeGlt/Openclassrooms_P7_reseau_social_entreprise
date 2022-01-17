const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const passwordSchema = require('../utils/password')
const emailValidator = require('email-validator')
const fs = require('fs')
const {Op} = require('sequelize')

exports.getProfile = (req, res, next) => {
    User.findOne({ where : { id: req.params.id }})
        .then(user => res.status(200).json(user))
        .catch(() => res.status(500).json({ message : 'Affichage de l\'utilisateur impossible' }))
}

exports.signup = (req, res, next) => {
    console.log(req.body)
    if(!passwordSchema.validate(req.body.password)) {
        return res.status(500).json({ message : 'Attention : le mot de passe est invalide :(' })
    }
    if(!emailValidator.validate(req.body.email)) {
        return res.status(500).json({ message : 'Attention : l\'email est invalide :(' })
    }
    if(!req.file.filename) {
        return res.status(500).json({ message : 'Pensez à vous ajouter une image ;)' })
    }
    if(!req.body.pseudo) {
        return res.status(500).json({ message : 'Pensez à vous créer un pseudo ;)' })
    }
    User.findOne({ where : {
        [Op.or]: [
            { email : req.body.email }, { pseudo : req.body.pseudo }
        ]}
    })
        .then(user => {
            if(!user) {
                bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    User.create({
                        email: req.body.email,
                        pseudo: req.body.pseudo,
                        password: hash,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                        isAdmin: req.body.isAdmin ? req.body.isAdmin : 0
                    })
                        .then(user => {
                            res.status(200).json({
                                userId: user.id,
                                pseudo: user.pseudo,
                                email: user.email,
                                imageUrl: user.imageUrl,
                                token: jwt.sign(
                                    {userId: user.id},
                                    process.env.TOKEN,
                                    {expiresIn: '24h'}
                                ),
                                message: 'Utilisateur créé !'
                            })
                        })
                        .catch((error) => res.status(500).json({ error }))
                })
                .catch(() => res.status(500).json({ message : 'erreur dans le hash' }))
            }else{
                res.status(403).json({ message : 'Email ou pseudo déjà utilisé :(' })
            }
        })
        .catch((error) => res.status(500).json({ error }))  
}

exports.login = (req, res, next) => {
    console.log(req.body)
    User.findOne({ where : { pseudo: req.body.pseudo }})
        .then(user => {
            if(!user) {
                return res.status(401).json({ message : 'Utilisateur non trouvé :(' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ message : 'Mot de passe incorrect ;)' })
                    }
                    res.status(200).json({
                        userId: user.id,
                        pseudo: user.pseudo,
                        email: user.email,
                        imageUrl: user.imageUrl,
                        token: jwt.sign(
                            {userId: user.id},
                            process.env.TOKEN,
                            {expiresIn: '24h'}
                        ),
                        message : 'Utilisateur connecté !'
                    })
                })
                .catch(() => res.status(500).json({ message : 'erreur dans le bcrypt compare' }))
        })
        .catch(() => res.status(500).json({ message : 'erreur dans l\'identification du pseudo' }))
}

exports.modifyProfile = (req, res, next) => {
    console.log(req.body)
    const userObject = req.file ? {
            ...req.body,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body
        }
        console.log(userObject)
    User.update({ ...userObject }, { where : { id : req.params.id }})
        .then(() => res.status(200).json({ message : 'Utilisateur modifié' }))
        .catch(() => res.status(500).json({ message : 'Erreur dans update' }))
}

exports.delete = (req, res, next) => {
    console.log(req.body.pseudo)
    User.findOne({ where : { pseudo : req.params.pseudo }})
        .then(user => {
            if(!user) {
                return res.status(401).json({ message : 'Utilisateur non trouvé :(' })
            }
            // bcrypt.compare(req.body.password, user.password)
            //     .then(valid => {
            //         if(!valid) {
            //             return res.status(401).json({ message : 'Mot de passe incorrect ;)' })
            //         }
            //         res.status(200)
            //     })
            //     .catch(() => res.status(500).json({ message : 'Erreur dans bcrypt' }))

            const filename = user.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                User.destroy({ where : { pseudo : req.params.pseudo }})
                    .then(() => res.status(200).json({ message : 'Utilisateur supprimé !' }))
                    .catch(() => res.status(500).json({ message : 'Suppression impossible !' }))
            })
        })
        .catch((error) => res.status(500).json({ error }))
}