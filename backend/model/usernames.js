const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const usernamesSchema = new Schema({
    name: {
        type: String, required: true
    }
})

usernamesSchema.pre('save', async function(next){
    var user = this
    const salt = await bcrypt.genSalt(10)
    const hashedpswd = await bcrypt.hash(user.name, salt)

    user.password = hashedpswd
})

usernamesSchema.methods.comparePswd = async function(name){
    try{
        const isMatch = await bcrypt.compare(name, this.name)
        return isMatch
    }catch(error){
        throw error;
    }
}

const Usernames = db.model('usernames', usernamesSchema)
module.exports = Usernames