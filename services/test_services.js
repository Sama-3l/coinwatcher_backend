const User = require('../model/user.js')
const jwt = require('jsonwebtoken');

class UserService {
    constructor() {
        this.existingUser = null;
    }

    static async registerUser(name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb) {
        try {
            const existingUser = await User.findOne({ email: email })
            const existingUsername = await User.findOne({ name: name })

            if (!existingUser) {
                if (!existingUsername) {
                    const createUser = new User({ name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb })
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
                else{
                    return {status: "400", token: ""}
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

    static async updateExpense(id, expense, eachMonthDb, eachDayDb) {

        console.log(id)
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
}

module.exports = UserService