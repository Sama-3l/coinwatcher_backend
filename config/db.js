const mongoose = require('mongoose')

var dbName = 'users'
var db = process.env.MONGODB_URI + dbName

const connection = mongoose.createConnection(db).on('open', () => {
    console.log('Connection set')
}).on('error', () => {
    console.log('Error')
})

module.exports = connection;