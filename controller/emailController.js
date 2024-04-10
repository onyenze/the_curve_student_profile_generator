require('dotenv').config();
const mongoose = require('mongoose');
const emailModel = require('../model/emailModel');
const {sendEmail} = require("../middlewares/email")
const dotenv = require("dotenv");
dotenv.config();






const getEmails = async (req, res) => {
  try {
    const { cohort, email } = req.body;
    const options = {
      maxTimeMS: 30000 // Increase the timeout value to 30 seconds (30000 milliseconds)
    };
    const cohortEmails = await emailModel.find({ cohort: cohort }, null, options);

    if (cohortEmails.length === 0) {
      const data = { cohort, email };
      const subject = "Welcome to The Curve Africa";
      const text = "Welcome on board The Curve, kindly click on the link to Sign Up https://thecurve-studentprofile.vercel.app/#/signup ";

      email.forEach(emailAddress => {
        console.log(emailAddress);
        sendEmail(emailAddress, subject, text);
      });

      await emailModel.insertMany(data, { ordered: false });
      const emails = await emailModel.find({ cohort: cohort }, null, options);
      res.status(200).json({ data: emails });
    } else {
      const subject = "Welcome to The Curve Africa";
      const text = "Welcome on board The Curve, kindly click on the link to Sign Up https://thecurve-studentprofile.vercel.app/#/signup ";

      email.forEach(emailAddress => {
        console.log(emailAddress);
        sendEmail(emailAddress, subject, text);
      });

      const exsitingEmails = cohortEmails[0].email;
      const joined = [...exsitingEmails, ...email];
      cohortEmails[0].email = joined;
      await cohortEmails[0].save(); // Save the updated document
      res.status(200).json({ data: cohortEmails });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getEmails}