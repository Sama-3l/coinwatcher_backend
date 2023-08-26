const User = require('../model/user.js')
const jwt = require('jsonwebtoken');
const Usernames = require('../model/usernames.js');

class UserService {
    constructor() {
        this.existingUser = null;
    }

    static async registerUser(name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb) {
        try {
            const existingUser = await User.findOne({ email: email });

            if (!existingUser) {
                const createUser = new User({ name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb })
                var result = await createUser.save()
                this.addUsername(name)
                const tokenData = {
                    _id: createUser._id,
                    email: email,
                    password: password,
                }
                const token = await this.generateToken(tokenData, process.env.ENCRYPTION_KEY, '365d')
                return {status: true, token: token}
            }
            else {
                return {status: false, token: ""}
            }

        } catch (err) {
            console.error('Error occurred while registering user:', err);
        }
    }

    static async addUsername(name) {
        try {
            const addUsername = new Usernames({ name })
            return await addUsername.save()
        } catch (error) {
            throw error
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

    static async verifyUserAndGetData(email, password){
        try {
            const existingUser = await User.findOne({ email: email });
            console.log(password)
            if (existingUser) {
                const isMatch = await existingUser.comparePswd(password)
                if(isMatch){
                    return existingUser
                }
                else{
                    return {"error" : "Error 401"} //Unauthorized response
                }
            }
            else{
                return {"error" : "Error 404"} //User not found
            }
        } catch (error) {
            
        }
    }

    static async generateToken(tokenData, secretKey, jwt_expire) {
        return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire })
    }
}

module.exports = UserService