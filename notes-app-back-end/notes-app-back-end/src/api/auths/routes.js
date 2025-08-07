const routes = (handler) => [
    {
        method: 'POST',
        path: '/auth',
        handler: handler.postAuthHandler,
    },
    {
        method: 'PUT',
        path: '/auth',
        handler: handler.putAuthHandler,
    },
    {
        method: 'DELETE',
        path: '/auth',
        handler: handler.deleteAuthHandler,
    },
];
// export
module.exports = routes;