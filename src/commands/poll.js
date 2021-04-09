import { MessageEmbed } from 'discord.js'
import _ from 'lodash'

import { CommandDefinition, CommandOption } from './command-definition.js'
import InteractionResponse from '../messages/interaction-response.js'
import EphemeralMessage from '../messages/ephemeral-message.js'
import { appendEmptyLine } from '../utils/embed.js'
import { models } from '../sequelize.js'
import { client } from '../discord.js'
import * as MessageUtils from '../utils/messages.js'

const KEYCAP_EMOJIS = [
  Buffer.from([0x30, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x31, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x32, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x33, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x34, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x35, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x36, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x37, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x38, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0x39, 0xef, 0xb8, 0x8f, 0xe2, 0x83, 0xa3]),
  Buffer.from([0xf0, 0x9f, 0x94, 0x9f])
].map(b => b.toString())

export function startReactionCollector(message) {
  const reactionCollector = message.createReactionCollector((reaction, _user) => (
    _.includes(_.drop(KEYCAP_EMOJIS, 1), reaction.emoji.name)
  ))

  reactionCollector.on('collect', (reaction, user) => {
    if (!reaction.me) {
      const hasAlreadyReacted = (MessageUtils.countReactionsFromUser(message, user.id) > 1)
      if (hasAlreadyReacted) {
        reaction.users.remove(user.id)
      }
    }
  })

  return reactionCollector
}

export default new CommandDefinition({
  name: 'poll',
  description: 'Teste de poll simples',
  options: [
    new CommandOption({ name: 'title', description: 'Um título para a poll', type: 'string', isRequired: true }),
    new CommandOption({ name: 'option1', description: 'Opção 1', type: 'string', isRequired: true }),
    new CommandOption({ name: 'option2', description: 'Opção 2', type: 'string', isRequired: true }),
    new CommandOption({ name: 'option3', description: 'Opção 3', type: 'string', isRequired: false }),
    new CommandOption({ name: 'option4', description: 'Opção 4', type: 'string', isRequired: false }),
    new CommandOption({ name: 'option5', description: 'Opção 5', type: 'string', isRequired: false }),
    new CommandOption({ name: 'option6', description: 'Opção 6', type: 'string', isRequired: false }),
    new CommandOption({ name: 'option7', description: 'Opção 7', type: 'string', isRequired: false }),
    new CommandOption({ name: 'option8', description: 'Opção 8', type: 'string', isRequired: false }),
    new CommandOption({ name: 'option9', description: 'Opção 9', type: 'string', isRequired: false }),
    new CommandOption({ name: 'option10', description: 'Opção 10', type: 'string', isRequired: false })
  ]
}).onReceiveInteraction((interaction) => {
  return new InteractionResponse(
    new EphemeralMessage(`now loading (interaction ${interaction.id})`)
  )
}).onFollowUp(async (interaction, responseMessage) => {
  interaction.ephemeralResponse = true
  await interaction.save()
  const channel = await client.channels.fetch(responseMessage.discordChannelId)
  const interactionOptions = _.get(interaction, 'originalJson.data.options')
  const titleOption = _.find(interactionOptions, { name: 'title' })
  const pollOptions = _.filter(interactionOptions, (o) => /^option\d\d?$/.test(o.name))
  const emptyField = { name: '\u200b', value: '\u200b' }
  let fields = _.flatMap(
    pollOptions,
    (po, index) => [{ name: KEYCAP_EMOJIS[index + 1], value: po.value }, emptyField]
  )

  const embed = new MessageEmbed()
    .setColor('DARK_GREEN')
    .setTitle(titleOption.value)
    .setDescription(appendEmptyLine('React with the corresponding emote to vote'))
    .setFooter('You can only vote on one option')
    .addFields(...fields)

  const pollMessage = await channel.send('', { embed, disableMentions: 'all' })
  const pollMessageInstance = await models.Message.createFromDiscordJs(pollMessage, { interactionId: interaction.id })
  await models.Poll.create({ messageId: pollMessageInstance.id, isSingleOption: true, choicesCommandOptionsJson: pollOptions })

  // an old-school for is the cleanest way to do these awaits sequentially
  // (which we want because the users will see the emotes in the right order)
  for (let index = 0; index < pollOptions.length; index++) {
    await pollMessage.react(KEYCAP_EMOJIS[index + 1])
  }

  startReactionCollector(pollMessage)
  return new EphemeralMessage(titleOption.value)
})
