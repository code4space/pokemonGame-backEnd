"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPokemon extends Model {
    static associate(models) {
      UserPokemon.belongsTo(models.User, { foreignKey: 'UserId' });
      UserPokemon.belongsTo(models.Pokemon, { foreignKey: 'PokemonId' });
    }
  }
  UserPokemon.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "UserId is required" },
          notNull: { msg: "UserId is required" },
        },
      },
      PokemonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "PokemonId is required" },
          notNull: { msg: "PokemonId is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "UserPokemon",
    }
  );
  return UserPokemon;
};
