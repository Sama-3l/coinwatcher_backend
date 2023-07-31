const User = require('../model/test.js')

class UserService {

    static async registerUser(name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb) {
        try {
            const existingUser = await User.findOne({ email: email });
            
            if(!existingUser){
                const createUser = new User({ name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb })
                return await createUser.save()
            }
            else{
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
                return isMatch
            }
            else {
                return false
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService