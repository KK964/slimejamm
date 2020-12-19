var useruuid = require('./nameUUID');
var mysqlConf = require('./mysqlconf.json');
var ms = require('ms');
var perms = ['perm', 'permanent', 'p'];
var types = ['ban', 'mute', 'warn'];
var index = require('../index');

var methods = {
  addBan: async function (server, name, time, reason, msg) {
    var uuid = await getUUID(name);
    var banTime = getDate();
    if (uuid != null) {
      if (!perms.includes(time.toLowerCase())) {
        //not perm
        var unBanTime = getNextDate(time);
        addBan(uuid, server, reason, banTime, unBanTime, time, msg);
      } else {
        //perm
        addBan(uuid, server, reason, banTime, 'null', 'Perm', msg);
      }
    } else {
      index.data.unknownUser(name, msg);
    }
  },
  addMute: async function (name, reason, msg) {
    var uuid = await getUUID(name);
    var muteTime = getDate();
    if (uuid != null) {
      addMute(uuid, reason, muteTime, msg);
    } else {
      index.data.unknownUser(name, msg);
    }
  },
  addWarn: async function (server, name, reason, msg) {
    var uuid = await getUUID(name);
    var warnTime = getDate();
    if (uuid != null) {
      addWarn(uuid, server, reason, warnTime, msg);
    } else {
      index.data.unknownUser(name, msg);
    }
  },
  getBans: async function (name, msg) {
    var uuid = await getUUID(name);
    if (uuid != null) {
      getBans(uuid, name, msg);
    } else {
      index.data.unknownUser(name, msg);
    }
  },
  getMutes: async function (name, msg) {
    var uuid = await getUUID(name);
    if (uuid != null) {
      getMutes(uuid, name, msg);
    } else {
      index.data.unknownUser(name, msg);
    }
  },
  getWarns: async function (name, msg) {
    var uuid = await getUUID(name);
    if (uuid != null) {
      getWarns(uuid, name, msg);
    } else {
      index.data.unknownUser(name, msg);
    }
  },
  delete: function (type, id, msg) {
    if (id) {
      if (types.includes(type.toLowerCase())) {
        deleteID(type.toLowerCase(), id, msg);
      } else {
        index.data.sendOtherMsg(`The type "${type}" is unknown\n> !mc delete <type> <id>`, msg);
      }
    } else {
      index.data.sendOtherMsg(`The id "${id}" is unknown\n> !mc delete <type> <id>`, msg);
    }
  },
};

function getUUID(name) {
  return new Promise((res, rej) => {
    res(useruuid.data.returnUUID(name));
  });
}

function getDate() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function getNextDate(time) {
  const nextDateMS = Date.now() + ms(time);
  const dateObject = new Date(nextDateMS);
  return dateObject.toISOString().slice(0, 19).replace('T', ' ');
}

const mysql = require('mysql');
var con = mysql.createConnection({
  host: mysqlConf.host,
  user: mysqlConf.user,
  password: mysqlConf.password,
  database: mysqlConf.database,
});

function addBan(uuid, server, reason, date, unban, time, msg) {
  console.log(`${uuid}, ${server}, ${reason}, ${date}, ${unban}, ${time}`);
  var query =
    'INSERT INTO bans (uuid, server, reason, banDate, unban, time) VALUES (?, ?, ?, ?, ?, ?)';
  con.query(query, [uuid, server, reason, date, unban, time], function (err, result) {
    if (err) {
      index.data.wasError(err, msg);
    } else {
      index.data.success(msg);
    }
  });
}

function addMute(uuid, reason, date, msg) {
  var query = 'INSERT INTO mutes (uuid, reason, muteDate) VALUES (?, ?, ?)';
  con.query(query, [uuid, reason, date], function (err, result) {
    if (err) {
      index.data.wasError(err, msg);
    } else {
      index.data.success(msg);
    }
  });
}

function addWarn(uuid, server, reason, date, msg) {
  var query = 'INSERT INTO warns (uuid, server, reason, warnDate) VALUES (?, ?, ?, ?)';
  con.query(query, [uuid, server, reason, date], function (err, result) {
    if (err) {
      index.data.wasError(err, msg);
    } else {
      index.data.success(msg);
    }
  });
}

function getBans(uuid, name, msg) {
  var query = 'SELECT * FROM bans WHERE uuid=?';
  con.query(query, [uuid], function (err, result) {
    if (err) {
      index.data.wasError(err, msg);
    } else {
      if (result.length > 0) {
        index.data.success(msg);
        var sendArr = [];
        sendArr.push(name + "'s " + 'bans:\n(ID, server, time, reason, date - unban date)');
        for (var i = 0; i < result.length; i++) {
          var uniqueID = result[i].uniqueID;
          var server = result[i].server;
          var time = result[i].time;
          var date = String(result[i].banDate).split(' ');
          date.splice(4, 8).shift(2);
          date.join(' ');
          var unbanDate = String(result[i].unban).split(' ');
          unbanDate.splice(4, 8).shift(2);
          unbanDate.join(' ');
          if (unbanDate == '0000-00-00,00:00:00') {
            unbanDate = 'Forever';
          }
          var reason = result[i].reason;
          var formated =
            '> **' +
            uniqueID +
            '**: `' +
            `${server}: ${time}: ${reason}: ${date} - ${unbanDate}` +
            '`';
          sendArr.push(formated);
        }
        index.data.returnNames(sendArr, msg);
      } else {
        index.data.noEntries(name, msg);
      }
    }
  });
}

function getMutes(uuid, name, msg) {
  var query = 'SELECT * FROM mutes WHERE uuid=?';
  con.query(query, [uuid], function (err, result) {
    if (err) {
      index.data.wasError(err, msg);
    } else {
      if (result.length > 0) {
        index.data.success(msg);
        var sendArr = [];
        sendArr.push(name + "'s " + 'mutes:\n(ID, date, reason)');
        for (var i = 0; i < result.length; i++) {
          var uniqueID = result[i].uniqueID;
          var date = String(result[i].muteDate).split(' ');
          date.splice(4, 8).shift(2);
          date.join(' ');
          var reason = result[i].reason;
          var formated = '> **' + uniqueID + '**: `' + `${date}: ${reason}` + '`';
          sendArr.push(formated);
        }
        index.data.returnNames(sendArr, msg);
      } else {
        index.data.noEntries(name, msg);
      }
    }
  });
}

function getMutes(uuid, name, msg) {
  var query = 'SELECT * FROM warns WHERE uuid=?';
  con.query(query, [uuid], function (err, result) {
    if (err) {
      index.data.wasError(err, msg);
    } else {
      if (result.length > 0) {
        index.data.success(msg);
        var sendArr = [];
        sendArr.push(name + "'s " + 'warns:\n(ID, server, reason, date)');
        for (var i = 0; i < result.length; i++) {
          var uniqueID = result[i].uniqueID;
          var server = result[i].server;
          var date = String(result[i].muteDate).split(' ');
          date.splice(4, 8).shift(2);
          date.join(' ');
          var reason = result[i].reason;
          var formated = '> **' + uniqueID + '**: `' + `${server}: ${reason}: ${date}` + '`';
          sendArr.push(formated);
        }
        index.data.returnNames(sendArr, msg);
      } else {
        index.data.noEntries(name, msg);
      }
    }
  });
}

function deleteID(type, id, msg) {
  var query = 'SELECT * FROM ' + type + 's WHERE uniqueID=?';
  con.query(query, [id], function (err, result) {
    if (err) {
      index.data.wasError(err, msg);
    } else {
      index.data.success(msg);
    }
  });
}

exports.data = methods;
