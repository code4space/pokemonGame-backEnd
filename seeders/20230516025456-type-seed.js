"use strict";

const { type } = require('../data/seed-data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Types", type);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Types", null, []);
  },
};
