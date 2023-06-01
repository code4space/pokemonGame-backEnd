"use strict";

const { user } = require('../data/seed-data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", user);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, []);
  },
};
