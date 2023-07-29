const mongoose = require('mongoose');
const db = require('../config/db');

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
    dailyBudget: { type: String, required: true },
    thisMonthSpent: { type: String, required: true },
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

const User = db.model('users', userSchema);

module.exports = User;