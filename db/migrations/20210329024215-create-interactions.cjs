'use strict'

const { generateDefaultFieldsDefinition } = require('../migration-utils.cjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('interactions', {
      ...generateDefaultFieldsDefinition(Sequelize),
      discord_id: Sequelize.TEXT,
      discord_token: Sequelize.TEXT,
      ephemeral_response: Sequelize.BOOLEAN,
      response_was_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      response_json: Sequelize.JSON,
      original_json: Sequelize.JSON
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('interactions')
  }
}
