const Joi = require('joi');

const CollaborationSchema = Joi.object({
    noteId: Joi.string().required(),
    userId: Joi.string().required(),
})

module.exports = {CollaborationSchema};