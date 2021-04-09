import Sequelize from 'sequelize'

// Sequelize does not setup module.exports in a es module-friendly way
const { DataTypes, Model } = Sequelize

export default class Interaction extends Model {
  static modelName = 'Interaction'
  static attributes = {
    discordId: DataTypes.TEXT,
    discordToken: DataTypes.TEXT,
    ephemeralResponse: DataTypes.BOOLEAN,
    responseWasDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    responseJson: DataTypes.JSON,
    originalJson: DataTypes.JSON
  }
  static references = {
    hasMany: [ 'Message' ]
  }
  static options = {}

  static createFromInteractionJson(interactionJson) {
    return this.create({
      discordId: interactionJson.id,
      discordToken: interactionJson.token,
      originalJson: interactionJson
    })
  }
}
