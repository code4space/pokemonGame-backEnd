'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pokemons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hp: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      attack: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      def: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      baseExp: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      power: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      img1: {
        type: Sequelize.STRING,
        allowNull: false
      },
      img2: {
        type: Sequelize.STRING,
        allowNull: false
      },
      summary: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pokemons');
  }
};