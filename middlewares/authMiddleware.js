const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel')

// auth Middleware
const userAuth = (req, res, next)=>{
    const hasAuthorization = req.headers.authorization;
    if(!hasAuthorization) {
        res.status(403).json({
            message: 'No Authorization Found'
        });
    } else {
        const token = hasAuthorization.split(' ')[1];
        try {
            // console.log(req.headers)
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = JSON.stringify(decodedToken);
            req.userId = decodedToken.userId;
            req.userEmail = decodedToken.email;
            req.username = decodedToken.username;
            next()
        } catch (error) {
            res.status(500).json({
                message: error.message,
                message2:"Please login"
            })
        }
    }
};





const authenticator = async (req, res,next)=>{
    
    const newUser = await userModel.findById(req.userId);
    const token = newUser.token;
    await jwt.verify(token, process.env.JWT_SECRET, (err, payLoad)=>{
        if(err){
            return res.status(403).json({
                message: 'token is not valid'
            })
        } else {
            req.newUser = payLoad;
            next();
        }
    })
}




const isAdminAuthorized = (req, res, next) => {
    authenticator(req, res, async ()=>{
        const existingUser = await userModel.findById(req.userId);
        if(existingUser.isAdmin == false){
            res.status(403).json({
                message: 'You are not an Admin'
            })
        } else {
            next()
        }
    })
}

const isSuperAdminAuthorized = (req, res, next) => {
    authenticator(req, res, async ()=>{
        const { id } = req.params;
        const existingUser = await userModel.findById(id);
        if(existingUser.isSuperAdmin == false){
            res.status(403).json({
                message: 'You are not a Super Admin'
            })
        } else {
            next()
        }
    })
}






module.exports = {
    userAuth,
    isAdminAuthorized,
    isSuperAdminAuthorized
}