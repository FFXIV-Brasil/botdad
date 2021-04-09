import _ from 'lodash'

import Interaction from './interaction.js'
import Message from './message.js'
import Poll from './poll.js'

function initModel(model, sequelize) {
  const baseOptions = { modelName: model.modelName, sequelize }
  return model.init(model.attributes, { ...baseOptions, ...model.options })
}

function defineAssociations(model, _modelName, models) {
  // According to Sequelize's docs, the order is important.
  // Basically you can't do the belongs before the has.
  const associationTypes = [ 'hasOne', 'hasMany', 'belongsTo', 'belongsToMany' ]
  _.each(associationTypes, (assocType) => {
    const associationDefinitions = _.get(model, [ 'references', assocType ])
    _.each(associationDefinitions, (associationDefinition) => {
      if (_.isString(associationDefinition)) {
        associationDefinition = { name: associationDefinition }
      }

      const { name: associationName, options } = associationDefinition
      console.log('assocType', assocType)
      console.log('associationName', associationName)
      console.log('models[associationName]', models[associationName])
      model[assocType](models[associationName], options)
    })
  })
}

export const initModels = (sequelize) => {
  const initializedModels = {
    Interaction: initModel(Interaction, sequelize),
    Message: initModel(Message, sequelize),
    Poll: initModel(Poll, sequelize)
  }

  _.each(initializedModels, defineAssociations)
  return initializedModels
}
