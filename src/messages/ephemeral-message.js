import _ from 'lodash'

import Message from './message.js'
import { EPHEMERAL } from './flags.js'

export default class EphemeralMessage extends Message {
  constructor(content, options) {
    super(content)
    super.addFlag(EPHEMERAL)

    if (_.get(options, 'embeds[0]')) {
      throw new Error("ephemeral messages can't have embeds (they are ignored by discord's API)")
    } else if (_.get(options, 'flags[0]')) {
      this.throwFlagsNotCustomizableError()
    }
  }

  throwFlagsNotCustomizableError() {
    throw new Error("ephemeral messages flags are not customizable")
  }

  addFlag(_flag) {
    this.throwFlagsNotCustomizableError()
  }

  removeFlag(_flag) {
    this.throwFlagsNotCustomizableError()
  }
}
