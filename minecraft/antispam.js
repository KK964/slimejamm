const levenshtein = require('../StringLevenshtein/levenshtein');
const ms = require('ms');
const removeTime = 5;
const betweenMessage = 500;
const { MessageEmbed } = require('discord.js');

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
    //console.log(message);
    handleData(player, message, msg);
  },
};

function handleData(player, msg, message) {
  sendingFast(player);
  compareMessages(player, msg);
  check(player, msg, message);
}

function setMessage(player, msg) {
  client.antiMsg.set(player, { msg: msg, ms: Date.now() });
}

async function compareMessages(player, msg) {
  if (client.antiMsg.get(player)) {
    var preMsgs = await client.antiMsg.get(player).msg;
    var msgChar = msg.length;
    var needsChange = await levenshtein(msg, preMsgs);
    if (needsChange < msgChar * 0.9) {
      var score = getScore(player);
      client.spamScore.set(player, { score: score + msgChar, ms: Date.now() });
    }
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

function check(player, msg, message) {
  var score = getScore(player);
  if (score > 10) {
    logSpams(player, msg, score, message);
  }
  if (score > 20) {
    //logReports(player, msg, score, message);
  }
}

function logSpams(player, msg, score, message) {
  var msgUser = player + ' I may be spamming.';
  var linkToMessage =
    'https://discord.com/channels/' + `${message.guild.id}/${message.channel.id}/${message.id}`;

  const spamEm = new MessageEmbed()
    .setTitle(msgUser)
    .setColor('#ff0000')
    .setDescription('Triggered by [Message](' + linkToMessage + '). Score: ' + score)
    .setTimestamp();
  client.channels.cache.get('735006102344958022').send(spamEm);
}

function logReports(player, msg, score, message) {
  if (
    !client.reportCooldown.get(player) ||
    client.reportCooldown.get(player) + ms('1m') < Date.now()
  ) {
    if (client.reportCooldown.get(player)) client.reportCooldown.delete(player);
    client.reportCooldown.set(player, Date.now());
    var msgUser = player + ' I may be spamming.';
    var linkToMessage =
      'https://discord.com/channels/' + `${message.guild.id}/${message.channel.id}/${message.id}`;

    const spamEm = new MessageEmbed()
      .setTitle(msgUser)
      .setColor('#ff0000')
      .setDescription('Triggered by [Message](' + linkToMessage + '). Score: ' + score)
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
