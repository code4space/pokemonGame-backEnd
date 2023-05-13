'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helper/bycrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Pokemon)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {msg: "Username must be unique"},
      validate: {
        notEmpty: { msg: "Username is required" },
        notNull: { msg: "Username is required" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
        notNull: { msg: "Password is required" },
      },
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user, opt) => {
    user.password = hashPassword(user.password)
  })
  return User;
};