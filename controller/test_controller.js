const UserService = require('../services/test_services')

exports.register = async(req, res, next) => {
    try {
        const {name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb} = req.body

        const successRes = await UserService.registerUser(name, email, password, dailyBudget, thisMonthSpent, allExpenses, eachMonthDb, eachDayDb)
        if(successRes == false){
            res.json({status: false, success: "User Already Exists", errorcode: 1})
        }
        else{
            res.json({status: true, success: "User Registered Successfully", errorcode: 0})
        }
    } catch (error) {
        throw error;
    }
}

exports.login = async(req, res, next) => {
    try{
        const {email, password} = req.body
        output = await UserService.checkUserInfo(email, password) 
        if(output.match){

            console.log(output.res)
            res.json({status: true, success: "Achieved", token: output.res})


        }
        else{
            console.log(output.res)
            res.json({status: true, success: "Not found", token: ""})
        }
    }catch(error){
        throw error;
    }
}