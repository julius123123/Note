const Joi = require('joi');
const { password } = require('pg/lib/defaults');

const PostAuthPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const PutAuthPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const DeleteAuthPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
})

module.exports = {
    PostAuthPayloadSchema,
    PutAuthPayloadSchema,
    DeleteAuthPayloadSchema,
};