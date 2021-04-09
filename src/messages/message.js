import { MessageFlags } from 'discord.js'
import _ from 'lodash'

export default class Message {
  #flags = new MessageFlags()
  #embeds
  #content

  constructor(contentOrOptions, options = {}) {
    let content, optionsObject

    if (_.isString(contentOrOptions)) {
      content = contentOrOptions
      optionsObject = options
    } else {
      content = undefined
      optionsObject = contentOrOptions
    }

    let { embeds, flags } = optionsObject
    this.#content = content
    this.#embeds = embeds
    _.each(flags, (f) => this.addFlag(f))
  }

  get content() {
    return this.#content
  }

  addFlag(flag) {
    this.#flags.add(flag)
  }

  removeFlag(flag) {
    this.#flags.remove(flag)
  }

  get flags() {
    return this.#flags.bitfield
  }

  hasFlag(flag) {
    return this.#flags.has(EPHEMERAL)
  }

  asData() {
    return {
      content: this.#content,
      embeds: this.#embeds?.map((embed) => embed.toJSON()),
      flags: this.flags
    }
  }
}
