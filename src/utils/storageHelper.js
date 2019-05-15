const storage = require('electron-json-storage')

export async function storageGet(key) {
    return new Promise((resolve, reject) => {
        storage.get(key, (error, data) => {
            if (error) reject(error)
            resolve(data)
        })
    })
}

export async function storageSet(key, value) {
    return new Promise((resolve, reject) => {
        storage.set(key, value, (error) => {
            if (error) reject(error)
            resolve()
        })
    })
}


