const User = require('../model/test.js')

class UserService{
    
    static async registerUser(name, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb){
        try{
            const createUser = new User({name, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb})
            return await createUser.save()
        }catch(err){
            console.error('Error occurred while registering user:', err);
        }
    }
}

module.exports = UserService