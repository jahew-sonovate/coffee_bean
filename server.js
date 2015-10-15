
var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    router = express.Router(),
    appRouter = express.Router();

require('./routes/coffee')(router);

/**
 * Main Application routing - all routes to / or /some or /some/value or /some/other/value will get caught here.
 */
appRouter.route('/').get(appRoute);
appRouter.route(/[-a-z0-9]+/i).get(appRoute);
appRouter.route(/[-a-z0-9]+\/[-a-z0-9]+/i).get(appRoute);
appRouter.route(/[-a-z0-9]+\/[-a-z0-9]+\/[-a-z0-9]+/i).get(appRoute);

app.use(bodyParser.json());
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/api', router);
app.use(appRouter);

app.listen(18513);
console.log('Server live at http://localhost:18513');

function appRoute(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
}
