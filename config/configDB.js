require('dotenv').config();
const mongoose = require('mongoose');

const DBpassword = process.env.DB_PASSWORD
const DBusername = process.env.DB_USERNAME


const db = `mongodb+srv://${DBusername}:${DBpassword}@cluster0.foaaql5.mongodb.net/`
// mongodb+srv://chibuezeonyenze123:i5qVNLFeDlSclNlO@cluster0.foaaql5.mongodb.net/
mongoose.connect(db).then(()=>{
    console.log('Database Connected')
}).catch((error)=>{
    console.log('Failed to connect to Database: ' + error.message)
});