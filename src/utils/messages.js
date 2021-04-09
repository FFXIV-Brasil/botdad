export function hasReaction(message, emojiCharacter) {
  return message.reactions.cache.some((messageReaction) => messageReaction.emoji.name === emojiCharacter)
}

export function hasReactionFromUser(message, emojiCharacter, userId) {
  return message.reactions.cache.some((messageReaction) => (
    messageReaction.emoji.name === emojiCharacter
      && messageReaction.users.cache.some((user) => user.id === userId)
  ))
}

export function countReactionsFromUser(message, userId) {
  return message.reactions.cache.filter((messageReaction) => (
    messageReaction.users.cache.some((user) => user.id === userId)
  )).size
}

export function hasAnyReactionFromUser(message, userId) {
  return message.reactions.cache.some((messageReaction) => (
    messageReaction.users.cache.some((user) => user.id === userId)
  ))
}

export function getEmojisReactedToMessage(message) {
  return message.reactions.cache.map((messageReaction) => messageReaction.emoji.name)
}
