import Sequelize from 'sequelize'

import { sequelizeConfig } from './config.js'
import { initModels } from './models/models.js'

export const sequelize = new Sequelize(sequelizeConfig)
export const models = initModels(sequelize)
