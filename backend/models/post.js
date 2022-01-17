const { Sequelize, Model, DataTypes } = require("sequelize")
const sequelize = require("../utils/dataBase")
const User = require("./user")

const Post = sequelize.define("post", {
    imageUrl: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    text: {
        type: DataTypes.STRING(300),
        defaultValue: null
    }
})

// date et id sont automatiques

User.hasMany(Post, {
    ondelete: 'cascade',
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

Post.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

module.exports = Post