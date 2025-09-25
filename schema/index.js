const Joi = require('joi');
const schema = Joi.object({
    firstname: Joi
        .string()
        .min(3)
        .max(30)
        .required(),
    lastname: Joi
        .string()
        .min(3)
        .max(30)
        .required(),
    age: Joi
        .number()
        .min(16)
        .required(),
    password: Joi
        .string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$'))
        .required(),
    repeat_password: Joi.ref('password'),
    email: Joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
        .required()
})

module.exports = { schema }