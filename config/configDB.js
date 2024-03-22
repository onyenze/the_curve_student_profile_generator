require('dotenv').config();
const mongoose = require('mongoose');

const DBpassword = process.env.DB_PASSWORD
const DBusername = process.env.DB_USERNAME


const db = `mongodb+srv://chibuezeonyenze123:zaKuoMhORY8S7FhH@cluster0.rbdob6c.mongodb.net/`

mongoose.connect(db).then(()=>{
    console.log('Database Connected')
}).catch((error)=>{
    console.log('Failed to connect to Database: ' + error.message)
});