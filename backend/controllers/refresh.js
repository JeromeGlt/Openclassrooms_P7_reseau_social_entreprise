const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.getUserDatas = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.TOKEN)
    const userId = decodedToken.userId

    User.findOne({ where : { id : userId }})
        .then(user => {
            if(!user) {
                return res.status(401).json({ message : 'Utilisateur non trouvé :(' })
            }
            res.status(200).json({
                userId: user.id,
                pseudo: user.pseudo,
                email: user.email,
                imageUrl: user.imageUrl,
                isAdmin: user.isAdmin
            })
        })
        .catch(() => res.status(500).json({ message : 'erreur dans l\'identification du pseudo' }))
}

exports.getUserPseudo = (req, res, next) => {

    User.findOne({ where : { id : req.params.user_id }})
        .then(user => {
            if(!user) {
                return res.status(401).json({ message : 'Utilisateur non trouvé :(' })
            }
            res.status(200).json({
                pseudo: user.pseudo,
                imageUrl: user.imageUrl
            })
        })
        .catch(() => res.status(500).json({ message : 'erreur dans l\'identification du pseudo' }))
}