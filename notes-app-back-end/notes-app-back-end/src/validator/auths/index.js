const InvariantError = require('../../execptions/InvariantError');
const {PostAuthPayloadSchema, PutAuthPayloadSchema, DeleteAuthPayloadSchema} = require('./schema');

const AuthValidator = {
    validatePostAuthPayload: (payload) => {
        const res = PostAuthPayloadSchema.validate(payload);

        if (res.error){
            throw InvariantError(res.error.message);
        }
    },

    validatePutAuthPayload: (payload) => {
        const res = PutAuthPayloadSchema.validate(payload);

        if (res.error){
            throw new InvariantError(res.error.message);
        }
    },

    validateDeleteAuthPayload: (payload) => {
        const res = DeleteAuthPayloadSchema.validate(payload);

        if (res.error){
            throw new InvariantError(res.error.message);
        }
    }
}

module.exports = AuthValidator;