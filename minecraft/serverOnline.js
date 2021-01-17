const fetch = require('node-fetch');

module.exports = (serverName, port, callback) => {
  if (!callback) {
    callback = port;
    port = null;
  }
  if (!port) {
    port = 25565;
  }
  fetch(`https://mcapi.us/server/status?ip=${serverName}&port=${port}`).then((result) => {
    result.json().then((data) => {
      callback(serverName, data);
    });
  });
};
