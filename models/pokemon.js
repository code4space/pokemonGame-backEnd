"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pokemon.belongsToMany(models.User, { through: models.UserPokemon });
      Pokemon.belongsToMany(models.Type, { through: models.TypePokemon });
    }
  }
  Pokemon.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name is required" },
          notNull: { msg: "Name is required" },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "hp is required" },
          notNull: { msg: "hp is required" },
        },
      },
      attack: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "attack is required" },
          notNull: { msg: "attack is required" },
        },
      },
      def: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "def is required" },
          notNull: { msg: "def is required" },
        },
      },
      baseExp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "baseExp is required" },
          notNull: { msg: "baseExp is required" },
        },
      },
      power: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "power is required" },
          notNull: { msg: "power is required" },
        },
      },
      img1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "img1 is required" },
          notNull: { msg: "img1 is required" },
        },
      },
      img2: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "img2 is required" },
          notNull: { msg: "img2 is required" },
        },
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "summary is required" },
          notNull: { msg: "summary is required" },
        },
      },
      frontView: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "frontView is required" },
          notNull: { msg: "frontView is required" },
        },
      },
      backView: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "backView is required" },
          notNull: { msg: "backView is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Pokemon",
    }
  );
  return Pokemon;
};
