import Joi from 'joi'

type RegisterUserParams = {
  email: string
  username: string
  password: string
  passwordRepeat: string
}

export const validateUser = (params: RegisterUserParams) =>
  Joi.object()
    .keys({
      email: Joi.string().email().max(50).required(),
      username: Joi.string().alphanum().min(3).max(20).required(),
      password: Joi.string().min(8).required(),
      passwordRepeat: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .options({ messages: { any: { allowOnly: 'must match password' } } }),
    })
    .validate(params)
