'use strict'

const { generateDefaultFieldsDefinition } = require('../migration-utils.cjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('polls', {
      ...generateDefaultFieldsDefinition(Sequelize),
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      is_single_option: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      message_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'messages',
          key: 'id'
        }
      },
      choices_command_options_json: {
        type: Sequelize.JSON,
        allowNull: false
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('polls')
  }
}
