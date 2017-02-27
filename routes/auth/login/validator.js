const Joi = require('joi');
const validate = require('express-validation');

let validator = {
  body: { // params, body, query, headers, cookies
    username: Joi.string().alphanum().min(6).max(25).required(),
    password: Joi.string().alphanum().min(6).max(25).required()
  }
};

module.exports = validate(validator);
