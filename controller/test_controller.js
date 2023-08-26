const UserService = require('../services/test_services')

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb } = req.body

        const successRes = await UserService.registerUser(name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb)
        if (successRes.status == false) {
            res.json({ status: successRes.status, success: "User Already Exists", token: successRes.token })
        }
        else {
            res.json({ status: successRes.status, success: "User Registered Successfully", token: successRes.token })
        }
    } catch (error) {
        throw error;
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        output = await UserService.checkUserInfo(email, password)
        if (output.match) {

            console.log(output.res)
            res.json({ status: true, success: "Achieved", token: output.res })


        }
        else {
            console.log(output.res)
            res.json({ status: true, success: "Not found", token: "" })
        }
    } catch (error) {
        throw error;
    }
}

exports.getData = async (req, res, next) => {
    try {
        const { email, password } = req.body
        output = await UserService.verifyUserAndGetData(email, password)
        res.json({ status: true, data: output });
    } catch (error) {
        throw error;
    }
}