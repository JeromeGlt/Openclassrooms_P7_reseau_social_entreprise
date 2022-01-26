const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = require('../utils/dataBase')
const User = require('./user')
const Post = require('./post')

const Like = sequelize.define("like", {})

User.hasMany(Like, {
    ondelete: 'cascade',
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

Like.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

Post.hasMany(Like, {
    ondelete: 'cascade',
    foreignKey: {
        name: 'post_id',
        allowNull: false
    }
})

Like.belongsTo(Post, {
    foreignKey: {
        name: 'post_id',
        allowNull: false
    }
})

module.exports = Like