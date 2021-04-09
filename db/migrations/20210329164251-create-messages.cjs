'use strict'

const { generateDefaultFieldsDefinition } = require('../migration-utils.cjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      ...generateDefaultFieldsDefinition(Sequelize),
      discord_id: Sequelize.TEXT,
      discord_channel_id: Sequelize.TEXT,
      discord_guild_id: Sequelize.TEXT,
      interaction_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'interactions',
          key: 'id'
        }
      },
      original_json: Sequelize.JSON
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('messages')
  }
}
