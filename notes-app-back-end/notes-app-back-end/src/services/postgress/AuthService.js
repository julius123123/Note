const { Pool } = require("pg");
const InvariantError = require('../../execptions/InvariantError');

class AuthService{
    constructor(){
        this._pool = new Pool();
    }

    async addRefreshToken(token){
        const query = {
            text: 'INSERT INTO auths VALUES($1)',
            values: [token],
        };

        await this._pool.query(query);
    }

    async verifyRefreshToken(token){
        const query = {
            text: 'SELECT token FROM auths WHERE token = $1',
            values: [token],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new InvariantError("Refresh token tidak valid");
        }
    }

    async deleteRefreshToken(token){
        const query = {
        text: 'DELETE FROM auths WHERE token = $1',
        values: [token],
        };

        await this._pool.query(query);
    }
}

module.exports = AuthService;