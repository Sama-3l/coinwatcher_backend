const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const expenseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
});

const monthSchema = new Schema({
    month: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    totalSpent: {
        type: String,
        required: true
    },
    categories: {
        type: [categorySchema]
    }
})

const daySchema = new Schema({
    date: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
})

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dailyBudget: { type: String, required: true },
    allExpenses: {
        type: [expenseSchema],
    },
    eachMonthDb: {
        type: [monthSchema]
    },
    eachDayDb: {
        type: [daySchema]
    }
});

userSchema.pre('save', async function(next){
    var user = this
    const salt = await bcrypt.genSalt(10)
    const hashedpswd = await bcrypt.hash(user.password, salt)

    user.password = hashedpswd
})

userSchema.methods.comparePswd = async function(pswd){
    try{
        const isMatch = await bcrypt.compare(pswd, this.password)
        return isMatch
    }catch(error){
        throw error;
    }
}

const User = db.model('users', userSchema);

module.exports = User;