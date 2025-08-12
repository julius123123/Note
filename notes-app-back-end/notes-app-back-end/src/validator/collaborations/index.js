const {CollaborationSchema} = require('./schema');
const InvariantError = require('../../execptions/InvariantError');

const ColaborationsValidator = {
    validateCollaborationPayload: (payload) => {
        const validationResult = CollaborationSchema.validate(payload);

        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = ColaborationsValidator;