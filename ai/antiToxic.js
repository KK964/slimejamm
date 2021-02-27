require('@tensorflow/tfjs-node');
const toxicity = require('@tensorflow-models/toxicity');
const ms = require('ms');
const config = require('../cfg.json');
const threshold = 0.7;
const atTime = 5;

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
    handleData(message, server, player, msg);
  },
};

var client;

function handleData(message, server, player, msg) {
  run(message, server, player, msg);
}

function run(message, server, player, msg) {
  var sentences = [message];
  var isToxic = false;
  var setOff = [];
  toxicity.load(threshold).then((model) => {
    model.classify(sentences).then((predictions) => {
      for (var e = 0; e < sentences.length; e++) {
        for (var f of predictions) {
          var label = f.label;
          var match = f.results[e].match;
          var probabilities = f.results[e].probabilities;
          if (match && match == true) {
            isToxic = true;
            setOff.push(label + ': ' + probabilities);
          }
        }
      }

      if (isToxic) {
        handleToxic(player, server, message, msg, setOff);
      }
    });
  });
}

function getScore(player) {
  if (!client.toxicScore.get(player)) return 0;
  return client.toxicScore.get(player).score;
}

function handleToxic(player, server, message, msg, label) {
  var formatted = 'Set off for: ' + label.join(', ') + '\n' + msToDate(time) + '`' + message + '`';
  client.toxicScore.set({ score: getScore(player) + 10, ms: Date.now() });
  check(player, message, msg, formatted, server);
}

function check(player, msg, message, input, server) {
  var score = getScore(player);
  input = input || '`' + msg + '`';
  if (score > 5) {
    logSpams(player, msg, score, message, input, server);
  }
  if (score > 30) {
    logReports(player, msg, score, message, input, server);
  }
}

function logSpams(player, msg, score, message, input, server) {
  if (!client.charCooldown.get(player) || client.charCooldown.get(player).score < score) {
    var msgUser = player + ' I may be toxic, on ' + server;
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
    !client.charCooldown.get(player) ||
    (client.charCooldown.get(player).score < score &&
      Date.now() > client.charCooldown.get(player).ms + ms('30s'))
  ) {
    client.charCooldown.set(player, { ms: Date.now(), score: score });
    var msgUser = player + ' I may be toxic, on ' + server;
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

function msToDate(inms) {
  var d = new Date(inms);
  var ds = d.toLocaleTimeString();
  return ds;
}

function repeating() {
  client.toxicScore.forEach((e, key, map) => {
    //console.log(key + ' ' + e.score + ' ' + e.ms);
    var newScore = e.score - 1;
    if (newScore <= 0) {
      client.toxicScore.delete(key);
    } else {
      client.toxicScore.set(key, { score: newScore, ms: Date.now() });
    }
  });

  setTimeout(() => {
    repeating();
  }, ms('1m'));
}

function repeating2() {
  client.toxicCooldown.forEach((e, key, map) => {
    //console.log(key + ' ' + e.score + ' ' + e.ms);
    var newScore = e.score - 1;
    if (newScore <= 0) {
      client.toxicCooldown.delete(key);
    } else {
      client.toxicCooldown.set(key, { ms: Date.now(), score: newScore });
    }
  });

  setTimeout(() => {
    repeating2();
  }, ms('2m'));
}
