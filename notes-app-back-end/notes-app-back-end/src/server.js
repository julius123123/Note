require('dotenv').config();
const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NoteService = require('./services/postgress/NoteService');
const NotesValidator = require('./validator/notes');
const ClientError = require('./execptions/ClientError');

const users = require('./api/users');
const UserService = require('./services/postgress/UserService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const noteService = new NoteService();
  const userService = new UserService();

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
    }
])

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
