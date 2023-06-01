'use strict';

const { typePokemon } = require('../data/seed-data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("TypePokemons", typePokemon);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TypePokemons", null, []);
  },
};
