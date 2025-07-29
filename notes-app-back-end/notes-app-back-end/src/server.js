const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NoteService = require('./services/inMemory/NoteService');
const NotesValidator = require('./validator/notes');
const ClientError = require('./execptions/ClientError');
const init = async () => {
  const noteService = new NoteService();


  const server = Hapi.server({
    port: 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });


  await server.register({
    plugin: notes,
    options: {
      service: noteService,
      validator: NotesValidator,
    }
  })

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
