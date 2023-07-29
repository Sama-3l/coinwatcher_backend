const UserService = require('../services/test_services')

exports.register = async(req, res, next) => {
    try {
        console.log(req.body)
        const {name, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb} = req.body
        console.log(allExpenses)

        const successRes = await UserService.registerUser(name, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb)

        res.json({status: true, success: "User Registered Successfully"})
    } catch (error) {
        throw error;
    }
}