const fetch = require('node-fetch');
const index = require('../index');
const getNanes = require('./UUIDnames');
var methods = {
    getUUIDNames: function (name, msg) {
        fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if(contentType && contentType.indexOf("application/json") !== -1) {
                response.json().then(data => {
                    getNanes.data.getNames(name, data.id, msg);
                })
            } else {
                index.data.unknownUser(name, msg);
            }
        })
    },
    getUUID: function (name, msg) {
        fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if(contentType && contentType.indexOf("application/json") !== -1) {
                response.json().then(data => {
                    index.data.returnID(name, data.id, msg);
                })
            } else {
                index.data.unknownUser(name, msg);
            }
        })
    }
}
exports.data = methods;