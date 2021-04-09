import _ from 'lodash'
import EphemeralMessage from '../messages/ephemeral-message.js'
import InteractionResponse from '../messages/interaction-response.js'

const NAME_VALIDATION_REGEX = /^[\w-]{1,32}$/
const COMMAND_OPTION_TYPES = {
  sub_command: 1,
  sub_command_group: 2,
  string: 3,
  integer: 4,
  boolean: 5,
  user: 6,
  channel: 7,
  role: 8
}

function validateSize(fieldName, field, sizeLimit, unit = 'elements') {
  const fieldInRange = _.chain(field).size().inRange(1, sizeLimit).value()
  if (!fieldInRange) {
    throw new Error(`invalid ${fieldName} ${JSON.stringify(field)} - must be between 1 and ${sizeLimit} ${unit}`)
  }
}

function validateOptionTypeRequirements(fieldName, currentType, validTypes) {
  const [initialTypes, lastType] = [_.initial(validTypes), _.last(validTypes)]
  const formattedValidTypes = `${initialTypes.join(', ')} or ${lastType}`
  if (!validTypes.includes(currentType)) {
    throw new Error(`command option is of type ${currentType} but can only have ${fieldName} if it's of type ${formattedValidTypes}`)
  }
}

class CommandComponent {
  #_name
  #_description

  constructor({ name, description }) {
    this.#name = name
    this.#description = description ?? name
  }

  get name() {
    return this.#_name
  }

  set #name(value) {
    if (NAME_VALIDATION_REGEX.test(value)) {
      this.#_name = value
    } else {
      throw new Error(`invalid name ${value} - must be between 1 and 32 characters and contain only characters A-Z, a-z, 0-9, "_" or "-"`)
    }
  }

  get description() {
    return this.#_description
  }

  set #description(value) {
    validateSize('description', value, 100, 'characters')
    this.#_description = value
  }
}

export class CommandOption extends CommandComponent {
  #_type
  #isRequired
  #_choices
  #_options

  constructor({ name, description, type, isRequired = false, choices, options }) {
    super({ name, description })
    this.#type = _.lowerCase(type)
    this.#isRequired = isRequired

    if (choices) {
      this.#choices = choices
    }

    if (options) {
      this.#options = options
    }
  }

  get type() {
    return this.#_type
  }

  set #type(value) {
    const validOptionTypes = _.keys(COMMAND_OPTION_TYPES)
    if (validOptionTypes.includes(value)) {
      this.#_type = value
    } else {
      const formattedValidTypes = validOptionTypes.map(t => `\n  - ${t}`).join('')
      throw new Error(`invalid command option type ${value} - ${formattedValidTypes}`)
    }
  }

  get isRequired() {
    return this.#isRequired
  }

  get choices() {
    return this.#_choices
  }

  set #choices(value) {
    validateSize('choices', value, 25, 'choices')
    validateOptionTypeRequirements('choices', this.type, ['string', 'integer'])
    this.#_choices = value
  }

  get options() {
    return this.#_options
  }

  set #options(value) {
    validateOptionTypeRequirements('options', this.type, ['sub_command', 'sub_command_group'])
    this.#_options = value
  }

  asParams() {
    return _.pickBy({
      type: COMMAND_OPTION_TYPES[this.type],
      name: this.name,
      description: this.description,
      required: this.isRequired,
      choices: this.choices?.map((c) => c.asParams()),
      options: this.choices?.map((o) => o.asParams())
    })
  }
}

export class CommandOptionChoice {
  #_name
  #_value

  constructor({ name, value }) {
    this.#name = name
    this.#value = value
  }

  get name() {
    return this.#_name
  }

  set #name(value) {
    validateSize('name', value, 100, 'characters')
    this.#_name = value
  }

  get value() {
    return this.#_value
  }

  set #value(value) {
    if (_.isString(value)) {
      validateSize('value', value, 100, 'characters')
    } else if (!_.isInteger(value)) {
      throw new Error(`invalid command option choice value ${value} - must be an integer or a string`)
    }
    this.#_value = value
  }

  asParams() {
    return _.pickBy({
      name: this.name,
      value: this.value
    })
  }
}

export class CommandDefinition extends CommandComponent {
  #options
  #interactionCallback = (_interaction) => (
    new InteractionResponse(
      new EphemeralMessage('Command not implemented (this should never happen!)')
    )
  )
  #followUpCallback = async (_interaction, _responseMessage) => undefined

  constructor({ name, description, options }) {
    super({ name, description })
    this.#options = options
  }

  get options() {
    return this.#options
  }

  handleReceiveInteraction(...args) {
    try {
      return this.#interactionCallback(...args).asData()
    } catch (error) {
      console.error(error)
    }
  }

  handleFollowUp(...args) {
    try {
      return this.#followUpCallback(...args)
    } catch (error) {
      console.error(error)
    }
  }

  asParams() {
    return _.pickBy({
      name: this.name,
      description: this.description,
      options: this.options?.map((o) => o.asParams())
    })
  }

  onReceiveInteraction(callback) {
    this.#interactionCallback = callback
    return this
  }

  onFollowUp(callback) {
    this.#followUpCallback = callback
    return this
  }
}

export default CommandDefinition
