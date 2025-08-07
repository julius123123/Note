require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt')
const ClientError = require('./execptions/ClientError');

//users
const users = require('./api/users');
const UserService = require('./services/postgress/UserService');
const UsersValidator = require('./validator/users');

//notes
const notes = require('./api/notes');
const NoteService = require('./services/postgress/NoteService');
const NotesValidator = require('./validator/notes');


//auths
const auths = require('./api/auths');
const AuthsService = require('./services/postgress/AuthService');
const TokenManager = require('./tokenize/TokenManager');
const AuthsValidator = require('./validator/auths');


const init = async () => {
  const noteService = new NoteService();
  const userService = new UserService();
  const authsService = new AuthsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
     {
        plugin: Jwt,
      },
  ])

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      }
    })
  })

  await server.register(
    [
      {
        plugin: notes,
        options: {
          service: noteService,
          validator: NotesValidator,
        }
      },
      {
        plugin: users,
        options: {
          service: userService,
          validator: UsersValidator,
        }
      },
      {
        plugin: auths,
        options: {
          authsService,
          usersService: userService,
          tokenManager: TokenManager,
          validator: AuthsValidator,
        },
      },
  ]);

  server.ext('onPreResponse', (request, h) =>{
    const {response} = request;

    if (response instanceof ClientError){
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      })

      newResponse.code(response.statusCode)
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
