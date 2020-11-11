const jwt = require('jsonwebtoken');

let socketMap = {};

module.exports.connection = socket => {
    let decodedToken = jwt.decode(socket.handshake.query.token);
    socketMap[decodedToken.id] = socket;
}

module.exports.refresh = function refresh(id) {
    socketMap[id].emit('refresh');
}

module.exports.refreshAll = function refreshAll() {
    for (const m in socketMap) {
        socketMap[m].emit('refresh');
    }
}
