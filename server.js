require('./config/configDB');
const cors = require("cors");
const morgan = require("morgan");

const fileUpload = require("express-fileupload")
const express = require('express');
PORT = process.env.PORT || 2221
const app = express();


app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cors({ origin: '*' }))

app.use(morgan("dev"));


const router = require('./route/userRoute');
const emailrouter = require('./route/emailRoute');

app.use(express.json());


app.use(express.urlencoded({extended:true}))
app.use(fileUpload({ 
    useTempFiles: true
}))


app.use('/api', router);
app.use('/api', emailrouter);



app.get('/', (req, res)=>{
    res.send('Welcome Message');
});

app.use("/uploaded-image", express.static(process.cwd() + "/uploads"));


app.listen(PORT, ()=>{
    console.log('The Server is listening on Port: ' + PORT)
});

