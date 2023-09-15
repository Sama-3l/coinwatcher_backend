const User = require('../model/user.js')
const jwt = require('jsonwebtoken');

class UserService {
    constructor() {
        this.existingUser = null;
    }

    static async registerUser(name, email, password, dailyBudget, allExpenses, eachMonthDb, eachDayDb) {
        try {
            const existingUser = await User.findOne({ email: email })
            const existingUsername = await User.findOne({ name: name })

            if (!existingUser) {
                if (!existingUsername) {
                    const createUser = new User({ name, email, password, dailyBudget, allExpenses, eachMonthDb, eachDayDb })
                    var result = await createUser.save()
                    const tokenData = {
                        _id: createUser._id,
                        email: email,
                        password: password,
                    }
                    const token = await this.generateToken(tokenData, process.env.ENCRYPTION_KEY, '365d')
                    console.log("NEW USER! \n")
                    console.log(name)
                    console.log(email)
                    console.log(password)
                    console.log('\n\n')
                    return { status: "200", token: token }
                }
                else {
                    return { status: "400", token: "" }
                }
            }
            else {
                return { status: "402", token: "" }
            }

        } catch (err) {
            console.error('Error occurred while registering user:', err);
        }
    }

    static async checkUserInfo(email, password) {
        try {
            const existingUser = await User.findOne({ email: email });

            if (existingUser) {
                const isMatch = await existingUser.comparePswd(password)
                if (isMatch) {
                    const tokenData = {
                        _id: existingUser._id,
                        email: email,
                        password: password,
                    }
                    const token = await this.generateToken(tokenData, process.env.ENCRYPTION_KEY, '365d')
                    return { match: isMatch, res: token }
                }
                return { match: isMatch, res: "Token Failed" }
            }
            else {
                return false
            }
        } catch (error) {
            throw error;
        }
    }

    static async verifyUserAndGetData(email, password) {
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                const isMatch = await existingUser.comparePswd(password)
                if (isMatch) {
                    return existingUser
                }
                else {
                    return { "error": "Error 401" } //Unauthorized response
                }
            }
            else {
                return { "error": "Error 404" } //User not found
            }
        } catch (error) {

        }
    }

    static async generateToken(tokenData, secretKey, jwt_expire) {
        return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire })
    }

    static async updateDailyBudget(id, budget) {

        const userData = await User.updateOne({ _id: id }, { $set: { dailyBudget: budget } })

        return userData
    }

    static async addExpense(id, expense, eachMonthDb, eachDayDb) {

        const userData = await User.updateOne(
            { _id: id },
            {
                $push: { allExpenses: expense },
                $set: {
                    eachMonthDb: eachMonthDb,
                    eachDayDb: eachDayDb
                }
            })
        return userData
    }

    static async deleteExpense(id, expense) {
        const req = await User.findOne({ _id: id }).then(async (user) => {
            const foundMonth = user.eachMonthDb.find(month => {
                const date = expense.date.split('-')
                if (date[0] === month.date.split('-')[0] && date[1] === month.date.split('-')[1]) {
                    var ts = parseFloat(month.totalSpent)
                    var originalAmount = parseFloat(expense.amount)
                    ts -= originalAmount
                    month.totalSpent = ts.toString()
                    month.categories.find(category => {
                        if (category.name === expense.category) {
                            var amount = parseFloat(category.amount)
                            amount -= expense.amount
                            category.amount = amount.toString()
                        }
                    })
                    return month
                }
            })
            await User.updateOne({ _id: user._id, 'eachMonthDb.month': foundMonth.month }, {
                $set: { 'eachMonthDb.$.totalSpent': foundMonth.totalSpent },
                $set: { 'eachMonthDb.$.categories': foundMonth.categories }
            });
        })

        const expense_id = await User.findOneAndUpdate({ _id: id }, {
            $pull: {
                allExpenses: {
                    name: expense.name,
                    amount: expense.amount,
                    date: expense.date,
                    category: expense.category
                }
            }
        })
    }

    static async updateExpense(id, originalExpense, currentExpense, allExpenses) {
        const req = await User.findOne({ _id: id }).then(async (user) => {
            const foundMonth = user.eachMonthDb.find(month => {
                const date = originalExpense.date.split('-')
                if (date[0] === month.date.split('-')[0] && date[1] === month.date.split('-')[1]) {
                    var ts = parseFloat(month.totalSpent)
                    var originalAmount = parseFloat(originalExpense.amount)
                    var currentAmount = parseFloat(currentExpense.amount)
                    ts -= originalAmount
                    ts += currentAmount
                    month.totalSpent = ts.toString()
                    month.categories.find(category => {
                        if (category.name === originalExpense.category) {
                            var amount = parseFloat(category.amount)
                            amount -= originalExpense.amount
                            category.amount = amount.toString()
                        }
                        if (category.name === currentExpense.category) {
                            var amount = parseFloat(category.amount)
                            amount += parseFloat(currentExpense.amount)
                            category.amount = amount.toString()
                        }
                    })
                    return month
                }
            })
            await User.updateOne({ _id: user._id, 'eachMonthDb.month': foundMonth.month }, {
                $set: { 'eachMonthDb.$.totalSpent': foundMonth.totalSpent },
                $set: { 'eachMonthDb.$.categories': foundMonth.categories }
            });
            const doc = await User.updateOne({
                _id: user._id}, {
                $set: { 'allExpenses': allExpenses },
            });
        });
    }
}

module.exports = UserService