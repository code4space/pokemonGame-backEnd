const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Pokemon {
    id: ID!
    name: String!
    hp: Int!
    attack: Int!
    def: Int!
  }

  type Type {
    id: ID!
    name: String!
    weakness: String!
  }

  type Query {
    electricPokemons: [Pokemon]
    allTypes: [Type]
    pokemonById(id: ID!): Pokemon
  }
`;

module.exports = typeDefs;
