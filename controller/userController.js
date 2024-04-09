require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../model/userModel');
const cloudinary = require("../utilities/cloudinary")
const emailModel = require('../model/emailModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const {sendEmail} = require("../middlewares/email")
// FUNCTIONALITIES FOR USER ALONE
// REGISTER USER 






const registration = async (req, res)=>{
    try {
        const { fullName, stack,email, password } = req.body;
        const ifUserBelongs = await emailModel.find
        const isEmail = await userModel.findOne({email});
        if (isEmail) 
            return res.status(400).json({
                message: `User already exists`
            })
        // var student = process.env.studentsEmail
        // if (!student.includes(email.toLowerCase())) {
        //     return res.status(400).json({
        //         message: `Email not registered`
        //     })
            
        // } else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash( password, salt )
            



            let result = null;
          if (req.files) {
            result= await cloudinary.uploader.upload(
              req.files.profilePicture.tempFilePath,{folder:"profilePicture"},
              (err, profilePicture) => {
                try {
                  return profilePicture;
                } catch (err) {
                  return err;
                }
              }
            );
          }






            const data = {
                fullName, 
                stack,
                email: email.toLowerCase(),
                password: hashPassword,
                profilePicture:result.secure_url,
                publicId:result.public_id
            };
            const user = new userModel(data);
            const savedUser = await user.save();

            
            const subject = 'Welcome to The Curve Africa'
            
            const text = "Welcome on board The Curve, kindly login into your account to download your template."

            
            sendEmail({
                email: savedUser.email,
                subject,
                text
            });
            if (!savedUser) {
                res.status(400).json({
                    message: 'Failed to Create Account'
                })
            } else {
                res.status(201).json({
                    message: 'Successfully created account',
                    data: savedUser
                });
            // }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}; 




const registration2 = async (req, res) => {
    try {
      const { fullName, stack, email, password } = req.body;
  
      // Check if the user's email exists in the emailModel
      const emailData = await emailModel.findOne({ email: { $in: email.toLowerCase() } });
  
      if (!emailData) {
        return res.status(400).json({
          message: `Email not registered`,
        });
      }
  
      const isEmail = await userModel.findOne({ email });
  
      if (isEmail) {
        return res.status(400).json({
          message: `User already exists`,
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      let result = null;
      if (req.files) {
        result = await cloudinary.uploader.upload(
          req.files.profilePicture.tempFilePath,
          { folder: "profilePicture" },
          (err, profilePicture) => {
            try {
              return profilePicture;
            } catch (err) {
              return err;
            }
          }
        );
      }
  
      const data = {
        fullName,
        stack,
        email: email.toLowerCase(),
        password: hashPassword,
        profilePicture: result?.secure_url,
        publicId: result?.public_id,
        cohort: emailData.cohort, 
      };
  
      const user = new userModel(data);
      const savedUser = await user.save();
  
      const subject = "Welcome to The Curve Africa";
      const text = "Welcome on board The Curve, kindly login into your account to download your template.";
  
      sendEmail({ email: savedUser.email, subject, text });
  
      if (!savedUser) {
        res.status(400).json({ message: "Failed to Create Account" });
      } else {
        res.status(201).json({
          message: "Successfully created account",
          data: savedUser,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };




const logIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({email});
        const invitedUser = await emailModel.findOne({ email: { $in: email.toLowerCase() } });
        if (!invitedUser) {
            return  res.status(403).json({
                  message: 'User Access not granted, Contact admin'
              });
          }
        if (!user) {
            return  res.status(404).json({
                  message: 'User not found'
              });
          }
        // var student = process.env.studentsEmail
        // if (!student.includes(email.toLowerCase())) {
        //   return  res.status(404).json({
        //         message: 'User not found'
        //     });
        // }   
        // if (user.isBlocked){
        //     return res.status(403).json({
        //         message: "This account has been blocked"
        //     })
        // }
         else {
            if(!user.isVerified) {
                res.status(400).json({
                    message: 'User not verified'
                })
            } else {
                const isPassword = await bcrypt.compare(password, user.password);
                if(!isPassword) {
                    res.status(400).json({
                        message: 'Email or Password incorrect'
                    });
                } else {
                    const userLogin = await userModel.findByIdAndUpdate(user._id, {islogin: true});
                    const loginToken = await genToken(user, {expiresIn: '1d'});
                    user.token = loginToken
                    await user.save()

                    res.status(200).json({
                        message: 'Log in Successful',
                        token: loginToken
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};



const signOut = async(req, res)=>{
    try {
        const { id } = req.params;
        token = ' ';
        const userLogout = await userModel.findByIdAndUpdate(id, {token: token});
        const logout = await userModel.findByIdAndUpdate(id, {islogin: false});
        // userLogout.token = ' ';
        // user.islogin = false;
        if(!userLogout) {
            res.status(400).json({
                message: 'User not logged out'
            })
        } else {
            res.status(200).json({
                message: 'User Successfully logged out',
                data: userLogout
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Gen-Token Function
const genToken = async(user,time)=>{
    const token = await jwt.sign({
        userId: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, time)
    return token
};


const changePassword = async(req, res)=>{
    try {
        const { password } = req.body;
        const { id } = req.params;
        const userpassword = await userModel.findById(id);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const final = await userModel.findByIdAndUpdate(userpassword, {password: hash}, {new: true});
        if (!final) {
            res.status(400).json({
                message: 'Failed to Change Password'
            })
        } else {
            res.status(200).json({
                message: 'Password Changed Successfully',
                data: userpassword
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const forgotPassword = async (req, res)=>{
    try {
        const { email } = req.body;
        const isEmail = await userModel.findOne({ email });
        if (!isEmail) {
            res.status(404).json({
                message: 'Email not found'
            })
        } else {
            const token = jwt.sign({
                id:isEmail.id
            }, process.env.JWT_SECRET, {expiresIn: '5m'})
            const subject = 'Link for Reset password'
            const link = `https://creativentstca.onrender.com/#/api/changepassword/${isEmail._id}/${token}`
            const message = `Forgot your Password? it's okay, kindly use this link ${link} to re-set your account password. Kindly note that this link will expire after 5(five) Minutes.`
            const html = generatePasswordEmail(link)
            sendEmail({
                email,
                subject,
                html
            });
            res.status(200).json({
                message: 'Email sent successfully, please check your Email for the link to reset your Password'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const registeredToken = token;
        const { password } = req.body;
        const { id } = req.params;
        const userpassword = await userModel.findById(id);
        if (!userpassword) {
            res.status(404).json({
                message: 'User not found'
            })
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const final = await userModel.findByIdAndUpdate(userpassword, {password: hash}, {new: true});
            await jwt.verify(registeredToken, process.env.JWT_SECRET, (err)=>{
                if(err) {
                    res.json('This Link is Expired. Send another Password Verification')
                } else {
                    if(!final){
                        res.status(404).json({
                            message: 'Failed to change Password'
                        })
                    } else {
                        res.status(200).json({
                            message: `Password changed successfully`
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


//add profile picture
// update profile



// Update and Delete a User 
// Updating a User.
const updateUsers = async (req, res)=>{
    try {
        const { stack, fullName } = req.body;
        const user = await userModel.findById(req.userId);
            
        
        
        
        let result = null;
    if (req.files) {
      if (user.profilePicture) {
        await cloudinary.uploader.destroy(user.publicId);
      }
      result= await cloudinary.uploader.upload(
        req.files.profilePicture.tempFilePath,{folder:"profilePicture"},
        (err, profilePicture) => {
          try {
            return profilePicture;
          } catch (err) {
            return err;
          }
        }
      );
    }
    user.stack = stack || user.stack
    user.fullName = fullName || user.fullName

  if (req.files){
        user.profilePicture = result.secure_url 
        user.publicId = result.public_id 
        console.log(result.secure_url);
        } else {
            user.profilePicture =  user.profilePicture;
            user.publicId =  user.publicId;
              }
            

            await user.save()
            if (!user) {
                res.status(400).json({
                    message: 'Failed to Update User'
                })
            } else {
                res.status(200).json({
                    message: 'User updated successfully',
                    data: user
                })
            }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}






const getUserProfile = async (req,res) => {
    try {
      const userID = req.userId
      const user = await userModel.findById(userID)
  
        res.status(200).json({ data: user });
    } catch (error) {
      throw new Error('Error fetching user with linked fields: ' + error.message);
    }
  };








module.exports = {
    registration,
    logIn,
    signOut,
    changePassword,
    forgotPassword,
    resetPassword,
    updateUsers,
    getUserProfile,
    registration2
};
// e choke