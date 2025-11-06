require('dotenv').config();
const path = require('path');
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
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

//collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgress/CollaborationService');
const CollaborationsValidator = require('./validator/collaborations');

//Exports
const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");

//uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

const init = async () => {
  const collaborationsService = new CollaborationsService;
  const noteService = new NoteService(collaborationsService);
  const userService = new UserService();
  const authsService = new AuthsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
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
      {
        plugin: Inert
      }
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
      {
        plugin: collaborations,
        options: {
          collaborationsService,
          noteService,
          validator: CollaborationsValidator,
        }
      },
      {
        plugin: _exports,
        options: {
          service: ProducerService,
          validator: ExportsValidator,
        }
      },
      {
        plugin: uploads,
        options: {
          service: storageService,
          validator: UploadsValidator,
        }
      }
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
