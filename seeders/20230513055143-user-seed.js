"use strict";

const { hashPassword } = require("../helper/bycrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        username: "admin",
        password: hashPassword("adminPokemon1"),
        draw: 100,
        balls: JSON.stringify({
          pokeball: 100,
          greatball: 100,
          ultraball: 100,
          masterball: 100,
        }),
        gacha: 24,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "cekidot",
        password: hashPassword("02193192028"),
        draw: 10,
        balls: JSON.stringify({
          pokeball: 7,
          greatball: 4,
          ultraball: 2,
          masterball: 1,
        }),
        gacha: 24,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Users", data, {
      fields: ["username", "password", "draw", "balls", "createdAt", "updatedAt"],
      returning: true,
      individualHooks: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, []);
  },
};
