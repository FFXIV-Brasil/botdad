import Sequelize from 'sequelize'

// Sequelize does not setup module.exports in a es module-friendly way
const { DataTypes, Model } = Sequelize

export default class Message extends Model {
  static modelName = 'Message'
  static attributes = {
    discordId: DataTypes.TEXT,
    discordChannelId: DataTypes.TEXT,
    discordGuildId: DataTypes.TEXT,
    originalJson: DataTypes.JSON,
    interactionId: DataTypes.INTEGER
  }
  static references = {
    belongsTo: [ 'Interaction' ],
    hasOne: [ 'Poll' ]
  }
  static options = {}

  static createFromDiscordJs(discordJsMessageInstance, extraAttributes = {}) {
    return this.create({
      discordId: discordJsMessageInstance.id,
      discordChannelId: discordJsMessageInstance.channel.id,
      discordGuildId: discordJsMessageInstance.guild.id,
      ...extraAttributes
    })
  }
}
