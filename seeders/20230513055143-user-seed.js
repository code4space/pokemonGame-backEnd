"use strict";

const { user } = require('../data/seed-data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", user, {
      fields: ["username", "password", "draw", "balls", "createdAt", "updatedAt"],
      returning: true,
      individualHooks: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, []);
  },
};
