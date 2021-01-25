const levenshtein = require('../StringLevenshtein/levenshtein');
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
  },
  check: (msg) => {
    var args = msg.content.split(' ');
    var player = args[1];
    var server = args[0];
    var spliceAm = 2;

    if (player == '->') {
      player = server;
      server = 'Unknown';
      spliceAm = 3;
    }

    player = player.replace(/(\[|\]|:|\*)/g, '');
    server = server.replace(/(\[|\]|:|\*)/g, '');
    args.splice(0, spliceAm);
    var message = args.join(' ');
    handleData(player, message, msg);
  },
};

function handleData(player, msg, message) {
  sendingFast(player);
  compareMessages(player, msg, message);
  if (
    client.reportCooldown.get(player) &&
    client.reportCooldown.get(player).ms + ms('20m') < Date.now()
  ) {
    client.reportCooldown.delete(player);
  }
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

function runLev(player, buf, preMsgs, msgChar, listOfMsgs, msg, message) {
  if (preMsgs.length > 0) {
    var i = 0;
    for (var e in preMsgs) {
      var retMsg = preMsgs[e].msg;
      var mill = preMsgs[e].ms;
      var time = msToDate(mill);
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
        check(player, msg, message, listOfMsgs.join('\n'));
      }
    }
  }
}

function compareMessages(player, msg, message) {
  if (client.antiMsg.get(player)) {
    var buf = getMessages(player);
    var preMsgs = buf.toarray();
    var msgChar = msg.length;
    var listOfMsgs = [];
    runLev(player, buf, preMsgs, msgChar, listOfMsgs, msg, message);
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

function check(player, msg, message, input) {
  var score = getScore(player);
  input = input || '`' + msg + '`';
  if (score > 20) {
    logSpams(player, msg, score, message, input);
  }
  if (score > 50) {
    logReports(player, msg, score, message, input);
  }
}

function logSpams(player, msg, score, message, input) {
  var msgUser = player + ' I may be spamming.';
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

function logReports(player, msg, score, message, input) {
  if (
    !client.reportCooldown.get(player) ||
    (client.reportCooldown.get(player).score < score &&
      client.reportCooldown.get(player).ms + ms('5m') < Date.now())
  ) {
    client.reportCooldown.set(player, { ms: Date.now(), score: score });
    var msgUser = player + ' I may be spamming.';
    var linkToMessage =
      'https://discord.com/channels/' + `${message.guild.id}/${message.channel.id}/${message.id}`;

    const spamEm = new MessageEmbed()
      .setTitle(msgUser)
      .setColor('#ff0000')
      .setDescription(
        'Triggered by [Message](' + linkToMessage + '). \n' + input + '\nScore: ' + score
      )
      .setTimestamp();
    client.channels.cache.get('592256625494982676').send(spamEm);
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
