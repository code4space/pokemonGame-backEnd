'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypePokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TypePokemon.belongsTo(models.Type, {foreignKey: 'TypeId'})
      TypePokemon.belongsTo(models.Pokemon, {foreignKey: 'PokemonId'})
    }
  }
  TypePokemon.init({
    TypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "TypePokemon is required" },
        notNull: { msg: "TypePokemon is required" },
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
  }, {
    sequelize,
    modelName: 'TypePokemon',
  });
  return TypePokemon;
};