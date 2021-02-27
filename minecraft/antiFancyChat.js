const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const config = require('../cfg.json');
var blacklist = ['(', ')', '{', '}', '[', ']', '|'];

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

    if (!player || !server) return;
    if (config.servers.includes(player)) return;

    player = player.replace(/(\[|\]|:|\*)/g, '');
    server = server.replace(/(\[|\]|:|\*)/g, '');
    args.splice(0, spliceAm);
    var message = args.join(' ');
    handleData(player, message, msg);
  },
};

function handleData(player, message, msg) {
  checkIfFancy(player, message);
  check(player, message, msg);
  if (
    client.fancyCooldown.get(player) &&
    client.fancyCooldown.get(player).ms + ms('20m') < Date.now()
  ) {
    client.fancyCooldown.delete(player);
  }
}

function checkIfFancy(player, msg) {
  var regex = /([a-z])\w+/gi;
  var res = [];
  for (var i = 0; i < msg.length; i++) {
    if (!blacklist.includes(msg[i])) {
      res.push(convertChar(msg[i]));
    } else {
      res.push(msg[i]);
    }
  }
  var afterCheck = res.join('');
  if (regex.test(afterCheck)) {
    client.fancyChat.set(player, { score: getScore(player) + 10, ms: Date.now() });
  }
}

function getScore(player) {
  var retval = 0;
  if (client.fancyChat.get(player)) retval = parseInt(client.fancyChat.get(player).score);
  return retval;
}

function convertChar(c) {
  c = c.charCodeAt(0);
  var hex1 = 0x21;
  var hex2 = 0x80;
  var hex3 = 0xfee0;
  if (c < hex1) return String.fromCharCode(c);
  c = c - hex3;
  c = String.fromCharCode(c);
  return c;
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
  if (!client.fancyCooldown.get(player) || client.fancyCooldown.get(player).score < score) {
    var msgUser = player + ' I may be using fancy chat.';
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

function logReports(player, msg, score, message, input) {
  if (
    !client.fancyCooldown.get(player) ||
    (client.fancyCooldown.get(player).score < score &&
      client.fancyCooldown.get(player).ms + ms('5m') < Date.now())
  ) {
    client.fancyCooldown.set(player, { ms: Date.now(), score: score });
    var msgUser = player + ' I may be using fancy chat.';
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
  client.fancyChat.forEach((e, key, map) => {
    //console.log(key + ' ' + e.score + ' ' + e.ms);
    var newScore = e.score - 1;
    if (newScore <= 0) {
      client.fancyChat.delete(key);
    } else {
      client.fancyChat.set(key, { score: newScore, ms: Date.now() });
    }
  });

  setTimeout(() => {
    repeating();
  }, ms('5s'));
}
