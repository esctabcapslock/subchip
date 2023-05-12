export const port = 80
export const isDev = process.argv.includes('-dev')
export const thisProgramPath = `${__dirname}/..`
export const emailRegexp = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/
export const imageRegexp = /\.(jpg|jpeg|png|gif|webp|tiff)$/