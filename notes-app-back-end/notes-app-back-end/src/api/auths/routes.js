const routes = (handler) => [
    {
        method: 'POST',
        path: '/authentications',
        handler: handler.postAuthHandler,
    },
    {
        method: 'PUT',
        path: '/authentications',
        handler: handler.putAuthHandler,
    },
    {
        method: 'DELETE',
        path: '/authentications',
        handler: handler.deleteAuthHandler,
    },
];
// export
module.exports = routes;