const { Sequelize, Model, DataTypes } = require("sequelize")
const sequelize = require("../utils/dataBase")

const User = sequelize.define("user", {
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    pseudo: {
        type: DataTypes.STRING(25),
        unique: true
    },
    password: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
})

module.exports = User