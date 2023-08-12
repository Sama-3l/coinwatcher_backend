const User = require('../model/test.js')
const jwt = require('jsonwebtoken')

class UserService {
    constructor() {
        this.existingUser = null;
    }

    static async registerUser(name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb) {
        try {
            const existingUser = await User.findOne({ email: email });

            if (!existingUser) {
                const createUser = new User({ name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb })
                return await createUser.save()
            }
            else {
                return false
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
                    const tokenData = { _id: existingUser._id, email: existingUser.email }
                    console.log(tokenData)
                    const token = await this.generateToken(tokenData, "Key", '365d')
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

    static async generateToken(tokenData, secretKey, jwt_expire) {
        return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire })
    }
}

module.exports = UserService