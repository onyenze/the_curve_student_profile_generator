const Joi = require("@hapi/joi");

const validationMiddleware = (req, res, next) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
    fullName: Joi.string()
      .regex(/^[A-Za-z ]+$/)
      .required()
      .messages({
        "string.base": "Please provide your full  name.",
        "string.empty": "Please provide your full name.",
        "string.regex.base": "First name should only contain letters.",
      }),
    email: Joi.string().email().required().messages({
      "string.base": "Please provide your email address.",
      "string.email": "Please provide a valid email address.",
      "string.empty": "Please provide your email address.",
    }),
    stack: Joi.string()
      .required()
      .messages({
        "string.base": "Please provide your stack.",
        "string.empty": "Please provide your stack.",
        "string.regex.base": "Stack should only contain letters.",
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
      .required()
      .messages({
        "string.base": "Please provide a password.",
        "string.empty": "Please provide a password.",
        "string.pattern.base":
          "Password must be at least 8 characters long and include one uppercase letter and one special character (!@#$%^&*).",
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
        "string.empty": "Please confirm your password.",
      }), // Must match the 'password' field, and it's required
  });

  // Validate the request body against the schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  // If there's a validation error, return a response with the error details
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(" ");
    return res.status(400).json({ message: errorMessage });
  }

  // If validation is successful, move to the next middleware
  next();
};

module.exports = { validationMiddleware };


