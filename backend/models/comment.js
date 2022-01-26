const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = require('../utils/dataBase')
const User = require('./user')
const Post = require('./post')

const Comment = sequelize.define("comment", {
    imageUrl: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    text: {
        type: DataTypes.STRING(300),
        defaultValue: null
    }
})

User.hasMany(Comment, {
    ondelete: 'cascade',
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

Comment.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

Post.hasMany(Comment, {
    ondelete: 'cascade',
    foreignKey: {
        name: 'post_id',
        allowNull: false
    }
})

Comment.belongsTo(Post, {
    foreignKey: {
        name: 'post_id',
        allowNull: false
    }
})

module.exports = Comment