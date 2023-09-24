const { Pokemon, Type } = require("../models");

const resolvers = {
  Query: {
    electricPokemons: async () => {
      const electricPokemons = await Pokemon.findAll();
      return electricPokemons;
    },
    allTypes: async () => {
      // Retrieve all unique Pokémon types from the database
      const types = await Type.findAll();
      return types;
    },
    pokemonById: async (_, { id }) => {
      // Fetch a Pokémon by its ID from the database
      const pokemon = await Pokemon.findByPk(id);
      return pokemon;
    },
  },
};

module.exports = resolvers;
