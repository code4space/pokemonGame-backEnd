"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPokemon extends Model {
    static associate(models) {
      UserPokemon.belongsTo(models.User, { foreignKey: 'userId' });
      UserPokemon.belongsTo(models.Pokemon, { foreignKey: 'pokemonId' });
    }
  }
  UserPokemon.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "userId is required" },
          notNull: { msg: "userId is required" },
        },
        field: 'userId',
      },
      pokemonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "pokemonId is required" },
          notNull: { msg: "pokemonId is required" },
        },
        field: 'pokemonId',
      },
    },
    {
      sequelize,
      modelName: "UserPokemon",
      tableName: "UserPokemons",
    }
  );
  return UserPokemon;
};
