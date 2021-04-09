import { Client } from 'discord.js'
import { DiscordInteractions as DiscordSlashCommands } from 'slash-commands'

import { models } from './sequelize.js'
import { envJson } from './config.js'

const client = new Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

const discordSlashCommands = new DiscordSlashCommands({
  applicationId: envJson.clientId,
  authToken: envJson.authToken,
  publicKey: envJson.publicKey
})

export function startBot() {
  return client.login(envJson.authToken)
}

export function onInteraction(handler) {
  client.ws.on('INTERACTION_CREATE', async (json) => {
    try {
      let interaction = await models.Interaction.createFromInteractionJson(json)
      return handler(interaction)
    } catch (error) {
      console.error(error)
    }
  })
}

export { client, discordSlashCommands }


// await discordSlashCommands
//   .createApplicationCommand(command, "496279654483886100")
//   .then(console.log)
//   .catch(console.error)

// app.get('/item/:id', async (req, res) => {
//   let itemId = req.params.id
//   let url = `https://ffxivcrafting.com/crafting/item/${itemId}?self_sufficient=1`
//   let content = await (await fetch(url)).text()
//   let $ = cheerio.load(content)
//
// })

// discordClient.ws.on('INTERACTION_CREATE', async (interaction) => {
//   let itemId = interaction.data.options[0].value
//   let url = `https://ffxivcrafting.com/crafting/item/${itemId}?self_sufficient=1`
//   let content = await (await fetch(url)).text()
//   let $ = cheerio.load(content)
//   let items = []
//   $('#Gathered-section tr:not([data-item-category=Crystal]) td.text-left').each((_, item) => {
//     items.push({
//       name: $('a.name', item).text().trim(),
//       location: $('.bonus-info .pointer span[title]', item).text().trim(),
//       coordinates: $('.bonus-info .pointer span[title]', item).attr('title').trim()
//     })
//   })
//
//   let message = items.map((item, i) => `
// **Item ${i + 1}**
// ---------------------------------
// **Nome**: ${item.name}
// **Local**: ${item.location}
// **Coordenadas aproximadas**: ${item.coordinates}
//
// `).join('\n')
//   discordClient.api.interactions(interaction.id, interaction.token).callback.post({
//     data: {
//       type: 3,
//       data: {
//         embeds: [
//           {
//             title: item.name,
//             description: 'Gathering',
//             fields: []
//           }
//         ]
//       }
//     }
//   })
// })

// const responseUrl = `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`
// const sentMessage = (await fetch(responseUrl, {
//   method: 'POST',
//   body: JSON.stringify(data),
//   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
// }))
