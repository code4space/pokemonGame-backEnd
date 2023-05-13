"use strict";

const { hashPassword } = require('../helper/bycrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        username: "admin",
        password: hashPassword("adminPokemon1"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "cekidot",
        password: hashPassword("02193192028"),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    await queryInterface.bulkInsert("Users", data, []);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, []);
  },
};
