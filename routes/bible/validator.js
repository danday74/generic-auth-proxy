const Joi = require('joi');
const validate = require('express-validation');

let validator = {
  query: { // params, body, query, headers, cookies
    q: Joi.string().required(),
    versions: Joi.string()
  }
};

module.exports = validate(validator);
