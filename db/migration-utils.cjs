const generateIdDefinition = (Sequelize) => ({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
})

const generateTimestampsDefinition = (Sequelize) => ({
  created_at: {
    type: Sequelize.DATE
  },
  updated_at: {
    type: Sequelize.DATE
  }
})

const generateParanoidTimestampDefinition = (Sequelize) => ({
  deleted_at: {
    type: Sequelize.DATE
  }
})

module.exports = {
  generateIdDefinition,
  generateTimestampsDefinition,
  generateParanoidTimestampDefinition,
  generateDefaultFieldsDefinition: (Sequelize) => ({
    ...generateIdDefinition(Sequelize),
    ...generateTimestampsDefinition(Sequelize),
    ...generateParanoidTimestampDefinition(Sequelize)
  })
}
