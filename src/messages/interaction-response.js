const CHANNEL_MESSAGE_WITH_SOURCE_RESPONSE_TYPE = 4

export default class InteractionResponse {
  #type = CHANNEL_MESSAGE_WITH_SOURCE_RESPONSE_TYPE
  #message

  constructor(message) {
    this.#message = message
  }

  get message() {
    return this.#message
  }

  asData() {
    return {
      type: this.#type,
      data: this.#message.asData()
    }
  }
}
