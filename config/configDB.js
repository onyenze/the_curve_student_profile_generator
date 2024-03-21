require('dotenv').config();
const mongoose = require('mongoose');

const DBpassword = process.env.DB_PASSWORD
const DBusername = process.env.DB_USERNAME


const db = `mongodb+srv://chibuezeonyenze123:7Ou29vdG9bNuluF9@cluster0.zbdio7o.mongodb.net/`

mongoose.connect(db).then(()=>{
    console.log('Database Connected')
}).catch((error)=>{
    console.log('Failed to connect to Database: ' + error.message)
});