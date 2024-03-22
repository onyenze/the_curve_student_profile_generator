require('dotenv').config();
const mongoose = require('mongoose');
const emailModel = require('../model/emailModel');
const {sendEmail} = require("../middlewares/email")



const addEmail = async (req,res)=>{
    try {
        // Ensure req.body is an array of emails
      if (!req.body || !req.body.cohort || !Array.isArray(req.body.email)) {
        return res.status(400).json({ error: 'Invalid request body. Expected an array of emails. and cohort' });
      }

      const {cohort,email} = req.body

      // Create an array of email documents
      const data = {
        cohort,
        email
      }
      console.log(data);
      // Insert the email documents into the collection
     const atm =  await emailModel.insertMany(data, { ordered: false });
      
    //   email.forEach(emailAddress => {
    //     sendMail(emailAddress);
    //   });

      const Email = await emailModel.find()
        res.status(200).json({ 
        message: 'Emails added successfully',
        data : Email ,
        data2: atm
    });
    } catch (error) {
        return error
    }
}



const getEmails = async (req,res) => {
    try {
        const {cohort, email} = req.body
        const cohortEmails = await emailModel.find({cohort:cohort})
        console.log(cohortEmails);
        if(cohortEmails.length === 0){
            data = {
                cohort,
                email
            }
            
            email.forEach(emailAddress => {
                sendEmail(emailAddress);
              });

             await emailModel.insertMany(data, { ordered: false });
        }else {
            

              email.forEach(emailAddress => {
                sendEmail(emailAddress);
              });


            const exsitingEmails = cohortEmails[0].email;


            const joined = [...exsitingEmails,...email]


            cohortEmails[0].email = joined
            await cohortEmails[0].save(); // Save the updated document
        }
        res.status(200).json({ data: cohortEmails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };

module.exports = {addEmail,getEmails}