require('dotenv').config()
const app = require('./app');
const db = require('./config/db')
const User = require('./model/user')
const PORT = process.env.PORT || 3000

// mongoose.set('strictQuery', async () => {
//     try{
//         const conn = await mongoose.connect(process.env.MONGO_URI)
//         console.log(`Connected: ${conn.connection.host}`)
//     }catch(e){
//         console.log(e)
//         process.exit(1)
//     }
// })



const port = process.env.PORT || 3000;

// app.post('/post', (req, res) => {
//     const data = req.body;
//     console.log(data.eachDayDb);
//     res.send('WOrked')
// });

app.listen(port, () => {
    console.log('Server listening on Port http://localhost:' + port);
});