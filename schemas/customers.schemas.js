import Joi from "joi"

export const schemaCustomers = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
    cpf: Joi.string().pattern(/^[0-9]{11}$/).required(),
    birthday: Joi.date().iso().required(),
})