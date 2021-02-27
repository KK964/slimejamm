const levenshtein = require('../StringLevenshtein/levenshtein');
const config = require('../cfg.json');
const ms = require('ms');
const removeTime = 5;
const betweenMessage = 500;
const { MessageEmbed } = require('discord.js');
const CircularBuffer = require('circular-buffer');
const emoj = {
  false: '❌',
  true: '✅',
};

var client;
module.exports = {
  start: (inClient) => {
    client = inClient;
    repeating();
    repeating2();
  },
  check: (msg) => {
    var args = msg.content.split(' ');
    var player = args[1];
    var server = args[0];
    var spliceAm = 2;

    if (player == '->') {
      player = server;
      server = '/msg `' + args[2].replace(/(\[|\]|:|\*)/g, '') + '`';
      spliceAm = 3;
    } else if (player == 'sent') {
      player = server;
      server = '/mail to `' + args[4].replace(/(\[|\]|:|\*)/g, '') + '`';
      spliceAm = 5;
    }

    if (!player || !server) return;
    if (config.servers.includes(player)) return;
    const reg = /(slain|fell|shot)/g;
    if (reg.test(msg.content)) return;

    player = player.replace(/(\[|\]|:|\*)/g, '');
    server = server.replace(/(\[|\]|:|\*)/g, '');
    args.splice(0, spliceAm);
    var message = args.join(' ');
    handleData(player, message, msg, server);
  },
};

function handleData(player, msg, message, server) {
  sendingFast(player);
  compareMessages(player, msg, message, server);
  //check(player, msg, message);
}

function setMessage(player, msg) {
  //client.antiMsg.set(player, { msg: msg, ms: Date.now() });
  var buf = getMessages(player);
  buf.push({ msg: msg, ms: Date.now() });
  client.antiMsg.set(player, buf);
}

function getMessages(player) {
  if (!client.antiMsg.get(player)) return new CircularBuffer(3);
  return client.antiMsg.get(player);
}

function getRatio(a, b, dif) {
  return (ratio = dif / (a + b));
}

function msToDate(inms) {
  var d = new Date(inms);
  var ds = d.toLocaleTimeString();
  return ds;
}

function runLev(player, buf, preMsgs, msgChar, listOfMsgs, msg, message, server) {
  if (preMsgs.length > 0) {
    var i = 0;
    for (var e in preMsgs) {
      var retMsg = preMsgs[e].msg;
      var mill = preMsgs[e].ms;
      var time = msToDate(mill);
      if (!retMsg) return;
      var msgChar2 = retMsg.length;
      var dif = levenshtein(msg, retMsg);
      var ratio = getRatio(msgChar, msgChar2, dif);
      var counts = false;
      var useEmoj = emoj.false;
      if (mill + ms('1m') > Date.now()) {
        counts = true;
        useEmoj = emoj.true;
      }
      listOfMsgs.push(useEmoj + ' ' + time + ': `' + retMsg + '`');
      if (ratio <= 1 / 10 && msgChar > 3 && counts == true) {
        var score = getScore(player);
        client.spamScore.set(player, { score: score + 10, ms: Date.now() });
      }
      i++;
      if (i == preMsgs.length) {
        listOfMsgs.push('New ' + ' ' + msToDate(Date.now()) + ': `' + msg + '`');
        check(player, msg, message, listOfMsgs.join('\n'), server);
      }
    }
  }
}

function compareMessages(player, msg, message, server) {
  if (client.antiMsg.get(player)) {
    var buf = getMessages(player);
    if (buf.size == 0) return;
    var preMsgs = buf.toarray();
    var msgChar = msg.length;
    var listOfMsgs = [];
    runLev(player, buf, preMsgs, msgChar, listOfMsgs, msg, message, server);
  }
  setMessage(player, msg);
}

function getScore(player) {
  var retval = 0;
  if (client.spamScore.get(player)) retval = client.spamScore.get(player).score;
  return retval;
}

function sendingFast(player) {
  var time = getTimeBetweenMessages(player);

  client.antiSpam.set(player, Date.now());

  if (time < betweenMessage) {
    var score = getScore(player);
    client.spamScore.set(player, { score: score + 1, ms: Date.now() });
  }
}

function getTimeBetweenMessages(player) {
  if (client.antiSpam.get(player))
    return Date.now - client.antiSpam.get(player) || Date.now() + 99999;
}

function check(player, msg, message, input, server) {
  var score = getScore(player);
  input = input || '`' + msg + '`';
  if (score >= 10) {
    logSpams(player, msg, score, message, input, server);
  }
  if (score >= 30) {
    logReports(player, msg, score, message, input, server);
  }
}

function logSpams(player, msg, score, message, input, server) {
  if (!client.reportCooldown.get(player) || client.reportCooldown.get(player).score < score) {
    var msgUser = player + ' I may be spamming, on ' + server;
    var linkToMessage =
      'https://discord.com/channels/' + `${message.guild.id}/${message.channel.id}/${message.id}`;

    const spamEm = new MessageEmbed()
      .setTitle(msgUser)
      .setColor('#ff0000')
      .setDescription(
        'Triggered by [Message](' + linkToMessage + '). \n' + input + '\nScore: ' + score
      )
      .setTimestamp();
    client.channels.cache.get('735006102344958022').send(spamEm);
  }
}

function logReports(player, msg, score, message, input, server) {
  if (
    !client.reportCooldown.get(player) ||
    (client.reportCooldown.get(player).score < score &&
      Date.now() > client.reportCooldown.get(player).ms + ms('30s'))
  ) {
    client.reportCooldown.set(player, { ms: Date.now(), score: score });
    var msgUser = player + ' I may be spamming, on ' + server;
    var linkToMessage =
      'https://discord.com/channels/' + `${message.guild.id}/${message.channel.id}/${message.id}`;

    const spamEm = new MessageEmbed()
      .setTitle(msgUser)
      .setColor('#ff0000')
      .setDescription(
        'Triggered by [Message](' + linkToMessage + '). \n' + input + '\nScore: ' + score
      )
      .setTimestamp();
    client.channels.cache.get('815095695383330857').send(spamEm);
  }
}

function repeating() {
  client.spamScore.forEach((e, key, map) => {
    //console.log(key + ' ' + e.score + ' ' + e.ms);
    var newScore = e.score - 1;
    if (newScore <= 0) {
      client.spamScore.delete(key);
    } else {
      client.spamScore.set(key, { score: newScore, ms: Date.now() });
    }
  });

  setTimeout(() => {
    repeating();
  }, ms('5s'));
}

function repeating2() {
  client.reportCooldown.forEach((e, key, map) => {
    //console.log(key + ' ' + e.score + ' ' + e.ms);
    var newScore = e.score - 1;
    if (newScore <= 0) {
      client.reportCooldown.delete(key);
    } else {
      client.reportCooldown.set(key, { ms: Date.now(), score: newScore });
    }
  });

  setTimeout(() => {
    repeating2();
  }, ms('20s'));
}
