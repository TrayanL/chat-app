const Joi = require('@hapi/joi');


//Register Validation
const registerValidation = (dataObject) => {
const schema = Joi.object({
  username: Joi.string().max(15).required(),
  password: Joi.string().min(8).required()
});
return schema.validate(dataObject)
}

module.exports.registerValidation = registerValidation;