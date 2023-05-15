'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helper/bycrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Pokemon, { through: models.UserPokemon });
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
    },
    draw: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "draw is required" },
        notNull: { msg: "draw is required" },
      },
    },
    balls: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Balls is required" },
        notNull: { msg: "Balls is required" },
      }
    },
    gacha: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "gacha is required" },
        notNull: { msg: "gacha is required" },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user, opt) => {
    user.password = hashPassword(user.password)
    user.draw = 10;
    user.balls = {
      pokeball: 7,
      greatball: 4,
      ultraball: 2,
      masterball: 1
    }
    user.gacha = 24
  })
  return User;
};