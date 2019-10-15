import { storageGet } from '../utils/storageHelper'

export async function getConfig () {
  const list = await storageGet('SERVER_LIST_PROD')
  const config = list.find(e => e.used)
  return config
}
