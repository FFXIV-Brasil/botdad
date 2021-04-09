import fs from 'fs'

const ENV = process.env.NODE_ENV ?? 'development'

function parseJsonConfig(configPath) {
  return JSON.parse(fs.readFileSync(configPath).toString())
}

export const configJson = parseJsonConfig('./config.json')
export const envJson = parseJsonConfig('./env.json')[ENV]
export const dbEnvJson = parseJsonConfig('./db/env.json')[ENV]
console.log(configJson.db)
console.log(dbEnvJson)

export const sequelizeConfig = {
  ...(configJson.db),
  ...(dbEnvJson)
}
