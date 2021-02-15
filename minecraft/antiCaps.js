const levenshtein = require('../StringLevenshtein/levenshtein');
const config = require('../cfg.json');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');

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
  compareMessages(player, msg, message, server);
}

function getRatio(a, dif) {
  return dif / a;
}

function msToDate(inms) {
  var d = new Date(inms);
  var ds = d.toLocaleTimeString();
  return ds;
}

function runLev(player, msgChar, msg, message, server) {
  var dif = levenshtein(msg, msg.toUpperCase());
  var ratio = getRatio(msgChar, dif);
  if (ratio <= 3 / 10 && msgChar > 3) {
    var score = getScore(player);
    client.capsScore.set(player, { score: score + 10, ms: Date.now() });
    check(player, msg, message, msToDate(Date.now()) + ': `' + msg + '`', server);
  }
}

function compareMessages(player, msg, message, server) {
  var msgChar = msg.length;
  runLev(player, msgChar, msg, message, server);
}

function getScore(player) {
  var retval = 0;
  if (client.capsScore.get(player)) retval = client.capsScore.get(player).score;
  return retval;
}

function check(player, msg, message, input, server) {
  var score = getScore(player);
  input = input || '`' + msg + '`';
  if (score > 20) {
    logSpams(player, msg, score, message, input, server);
  }
  if (score > 50) {
    logReports(player, msg, score, message, input, server);
  }
}

function logSpams(player, msg, score, message, input, server) {
  var msgUser = player + ' I may be using too many caps, on ' + server;
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

function logReports(player, msg, score, message, input, server) {
  if (
    !client.capsCooldown.get(player) ||
    (client.capsCooldown.get(player).score < score &&
      Date.now() > client.capsCooldown.get(player).ms + ms('30s'))
  ) {
    client.capsCooldown.set(player, { ms: Date.now(), score: score });
    var msgUser = player + ' I may be using too many caps, on ' + server;
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
  client.capsScore.forEach((e, key, map) => {
    //console.log(key + ' ' + e.score + ' ' + e.ms);
    var newScore = e.score - 1;
    if (newScore <= 0) {
      client.capsScore.delete(key);
    } else {
      client.capsScore.set(key, { score: newScore, ms: Date.now() });
    }
  });

  setTimeout(() => {
    repeating();
  }, ms('5s'));
}

function repeating2() {
  client.capsCooldown.forEach((e, key, map) => {
    //console.log(key + ' ' + e.score + ' ' + e.ms);
    var newScore = e.score - 1;
    if (newScore <= 0) {
      client.capsCooldown.delete(key);
    } else {
      client.capsCooldown.set(key, { ms: Date.now(), score: newScore });
    }
  });

  setTimeout(() => {
    repeating2();
  }, ms('20s'));
}
