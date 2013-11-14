var eventHandler = function () {
    var _events = require('events');
    var event = new _events.EventEmitter();
    event.on('SendResponse', function (response, data) {
        response.send(data);
    });
    return {
        event: event
    };
};
module.exports = eventHandler;