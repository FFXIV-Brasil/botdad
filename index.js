import _ from 'lodash'

import commands from './src/commands/index.js'
import { client, discordSlashCommands, onInteraction, startBot } from './src/discord.js'
import { models } from './src/sequelize.js'
import { envJson } from './src/config.js'

const commandResponses = await Promise.all(_.flatMap(envJson.guilds, ({ id }) => {
  return _.map(_.values(commands), (cd) => (
    discordSlashCommands.createApplicationCommand(cd.asParams(), id)
  ))
}))

onInteraction(async (interaction) => {
  const commandName = interaction.originalJson.data.name
  const command = commands[commandName]
  const responseData = command.handleReceiveInteraction(interaction)
  interaction.responseJson = responseData
  await interaction.save()

  await client.api.interactions(
    interaction.discordId, interaction.discordToken
  ).callback.post({ data: responseData })

  const message = await models.Message.create({
    discordId: '@original',
    interactionId: interaction.id,
    discordChannelId: interaction.originalJson.channel_id,
    discordGuildId: interaction.originalJson.guild_id,
    originalJson: responseData
  })

  await command.handleFollowUp(interaction, message)
})

await startBot()
