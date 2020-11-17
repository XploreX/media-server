module.exports = Object.freeze({
    root : __dirname,
    sessionSecret : process.env.SESSION_SECRET || 'secret',
    supportedVideoFormats : [
        'mp4',
        'mkv',
        'avi'
    ],
    dbConnectionString : process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/MediaServer' 
})