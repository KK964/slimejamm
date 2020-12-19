const fetch = require('node-fetch');
const { data } = require('../index');
const getNanes = require('./UUIDnames');
var methods = {
  getUUIDNames: function (name, msg) {
    fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`).then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        response.json().then((data) => {
          getNanes.data.getNames(name, data.id, msg);
        });
      } else {
        data.unknownUser(name, msg);
      }
    });
  },
  getUUID: function (name, msg) {
    fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`).then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        response.json().then((data) => {
          data.returnID(name, data.id, msg);
        });
      } else {
        data.unknownUser(name, msg);
      }
    });
  },
  returnUUID: function (name) {
    fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`).then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        response.json().then((data) => {
          return data.id;
        });
      } else {
        return null;
      }
    });
  },
};
exports.data = methods;
