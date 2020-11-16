const fetch = require('node-fetch');
const index = require('../index');
var methods = {
    getNames: function (name, uuid, msg) {
        var names = [];
        fetch(`https://api.mojang.com/user/profiles/${uuid}/names`)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if(contentType && contentType.indexOf("application/json") !== -1) {
                response.json().then(data => {
                    for(var i = Object.keys(data).length; i >= 0 ; i--) {
                        if(data[i]) {
                            if(data[i].changedToAt != null && data[i].changedToAt != undefined && data[i].name != null && data[i].name != undefined) {
                                names.push(`${data[i].name} | ${getDate(data[i].changedToAt)} days ago`);
                            } else {
                                if(data[i].name != null && data[i].name != undefined) {
                                    names.push(data[i].name);
                                }
                            }
                        }
                    }
                    if(!names.length == null) {
                        names.push(name);
                    }
                    index.data.returnNames(names, msg);
                })
            } else {
                index.data.unknownUser(name, msg);
            }
        })
    }
}

function getDate (timeInt) {
    var time = Math.floor((Date.now() - timeInt)/1000/60/60/24);
    return time;
}

exports.data = methods;