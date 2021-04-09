import Sequelize from 'sequelize'

// Sequelize does not setup module.exports in a es module-friendly way
const { DataTypes, Model } = Sequelize

export default class Poll extends Model {
  static modelName = 'Poll'
  static attributes = {
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    isSingleOption: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    choicesCommandOptionsJson: {
      type: DataTypes.JSON,
      allowNull: false
    },
    messageId: DataTypes.INTEGER
  }
  static references = {
    belongsTo: [ 'Message' ]
  }
  static options = {}
}
