'use strict';

const { pokemon } = require('../data/seed-data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Pokemons', pokemon, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Pokemons", null, []);
  }
};
