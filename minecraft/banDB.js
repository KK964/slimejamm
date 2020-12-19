var useruuid = require('./nameUUID');
var mysqlConf = require('./mysqlconf.json');
var ms = require('ms');
var perms = ['perm', 'permanent', 'p'];
var index = require('../index');

var methods = {
  addBan: function (server, name, time, reason, msg) {
    var uuid = getUUID(name);
    var banTime = getDate();
    var reason = reason | 'Unknown';
    var server = server | 'Unknown';
    if (uuid != null) {
      if (!perms.includes(time.toLowerCase())) {
        //not perm
        var unBanTime = getNextDate(time);
        addBan(uuid, server, reason, banTime, unBanTime, time, msg);
      } else {
        //perm
        addBan(uuid, server, reason, banTime, 'null', 'null', msg);
      }
    } else {
      index.data.unknownUser(msg);
    }
  },
  addMute: function (name, reason, msg) {
    var uuid = getUUID(name);
    var muteTime = getDate();
    var reason = reason | 'Unknown';
    if (uuid != null) {
      addMute(uuid, reason, muteTime, msg);
    } else {
      index.data.unknownUser(msg);
    }
  },
  getBans: function (name, msg) {
    var uuid = getUUID(name);
    if (uuid != null) {
      getBans(uuid, name, msg);
    } else {
      index.data.unknownUser(name, msg);
    }
  },
  getMutes: function (name, msg) {
    var uuid = getUUID(name);
    if (uuid != null) {
      getMutes(uuid, name, msg);
    } else {
      index.data.unknownUser(name, msg);
    }
  },
};

function getUUID(name) {
  return useruuid.index.data.returnUUID(name);
}

function getDate() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function getNextDate(time) {
  var nowDateMS = new Date().getMilliseconds();
  var nextDateMS = (nowDateMS + ms(time)) | nowDateMS;
  return new Date(nextDateMS).toISOString().slice(0, 19).replace('T', ' ');
}

const mysql = require('mysql');
var con = mysql.createConnection({
  host: mysqlConf.host,
  user: mysqlConf.user,
  password: mysqlConf.password,
  database: mysqlConf.database,
});

function addBan(uuid, server, reason, date, unban, time, msg) {
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

function getBans(uuid, name, msg) {
  var query = 'SELECT * FROM bans WHERE uuid=?';
  con.query(query, [uuid], function (err, result) {
    if (err) {
      index.data.wasError(err, msg);
    } else {
      if (result.length > 0) {
        var sendArr = [];
        sendArr.push(name + "'s " + 'bans:\n(server, time, date, reason)');
        for (res in result) {
          var server = res.server;
          var time = res.time;
          var date = res.banDate;
          var reason = res.reason;
          var formated = '> `' + `${server}: ${time}: ${date}: ${reason}` + '`';
          sendArr.push(formated);
        }
        index.data.returnNames(sendArr, msg);
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
        var sendArr = [];
        sendArr.push(name + "'s " + 'mutess:\n(date, reason)');
        for (res in result) {
          var date = res.banDate;
          var reason = res.reason;
          var formated = '> `' + `${date}: ${reason}` + '`';
          sendArr.push(formated);
        }
        index.data.returnNames(sendArr, msg);
      }
    }
  });
}

exports.data = methods;
