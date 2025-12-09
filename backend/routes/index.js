module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api', require('./user.js')(router));
    app.use('/api', require('./folder.js')(router));
    app.use('/api', require('./document.js')(router));

};