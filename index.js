require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const randEmoji = require('./randEmoji');
const bans = require('./minecraft/banDB');
const conf = require('./cfg.json');
const antispam = require('./minecraft/antispam');
const antiFacny = require('./minecraft/antiFancyChat');
const antiCaps = require('./minecraft/antiCaps');
const antiChar = require('./minecraft/antiChar');

client.spamMap = new Map();
client.antiSpam = new Map();
client.antiMsg = new Map();
client.spamScore = new Map();
client.reportCooldown = new Map();
client.fancyChat = new Map();
client.fancyCooldown = new Map();
client.capsScore = new Map();
client.capsCooldown = new Map();
client.charScore = new Map();
client.charCooldown = new Map();

//Minecraft stuff
const nameToUUID = require('./minecraft/nameUUID');
const serverOn = require('./minecraft/serverOnline');
const { transcode } = require('buffer');
//

//

//

//

const config = {
  token: process.env.TOKEN,
  prefix: '!',
};

//const guild = client.guilds.cache.get('295429838041382912')

var enabled = 1;
client.on('ready', () => {
  console.log(`SlimeSpider is online`);
  enabled = 1;
  console.log('SlimeSpider is now ON');
  wait(1000);
  //client.user.setPresence({activity:{name:"Sj's and berry's date", type:"STREAMING", url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, status:'online'});
  client.user.setPresence({
    activity: {
      name: 'is a slime',
      type: 'STREAMING',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    status: 'online',
  });
  antispam.start(client);
  antiFacny.start(client);
  antiCaps.start(client);
  antiChar.start(client);
});

var staffCatagories = ['409367358721884170', '414202025740337152'];

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (!oldPresence || !newPresence) return;
  if (newPresence.member.id == '738782832972922960') {
    if (oldPresence.status !== newPresence.status) {
      if (newPresence.status == 'offline') {
        client.channels.cache
          .get('756273724453421271')
          .send(
            'oi <@426892116258717707> your dum dum bot <@738782832972922960> went offline again...'
          );
      }
    }
  }
});

function sendAdvertisingMsg(msg, args, trigger) {
  var server = args[0];
  var advertiser = args[1];
  if (advertiser == '->') {
    advertiser = server;
    server = 'Unknown';
  }
  var msgUser =
    advertiser.replace(/(\[|\]|:|\*)/g, '') +
    ' I may of advertised on ' +
    server.replace(/(\[|\]|:|\*)/g, '');
  var linkToMessage =
    'https://discord.com/channels/' + `${msg.guild.id}/${msg.channel.id}/${msg.id}`;
  const advertisingEm = new Discord.MessageEmbed()
    .setTitle(msgUser)
    .setColor('#ff0000')
    .setDescription('Triggered by [' + trigger.join(', ') + '](' + linkToMessage + ')')
    .setTimestamp();
  if (trigger.length >= 0) {
    client.channels.cache.get('592256625494982676').send(advertisingEm); // release
    //client.channels.cache.get('754948719475949578').send(advertisingEm); // testing
  }
}

async function checkIfIp(msg, args, res, trigger) {
  var i = 0;
  for (i = 0; i < res.length; i++) {
    serverOn(res[i], 25565, (server, data) => {
      if (data.online == true) sendAdvertisingMsg(msg, args, [server]);
    });
  }
}
async function checkIfIp2(msg, args, res, trigger) {
  var i = 0;
  for (i = 0; i < res.length; i++) {
    serverOn(res[i], 25565, (server, data) => {
      if (data.online == true) {
        msg.delete();
        msg.channel.send(msg.member.displayName + ', do not advertise please.').then((delmsg) => {
          delmsg.delete({ timeout: 10000 });
          sendAdvertisingMsg(
            msg,
            ['Discord', msg.author.username + '#' + msg.author.discriminator],
            [server]
          );
        });
      }
    });
  }
}

client.on('message', (msg) => {
  if ((enabled = 1 && msg.author.id == '509785004965101579')) {
    if (msg.attachments.size > 0) {
      msg.delete();
    }
  }
  let args = msg.content.substring(config.prefix.length).split(' ');
  let arg = msg.content.split(' ');
  if (msg.channel.id == '615023024260775946') {
    if (msg.member.user.bot) return;
    msg.react('✅').then(msg.react('❌'));
  }
  if (msg.member && client.spamMap.has(msg.member.id)) {
    msg.reply('Okay stopping').then((msg2) => msg2.delete({ timeout: 10000 }));
    client.spamMap.delete(msg.member.id);
  }
  const inviteRegex = /(discord\.(gg|io|me|li)|discord(app)?\.com\/invite)(\/.+)/gi;
  const ipAdvertising = /(\w.\w+).(minehut.gg|aternos.me)/gi;
  const ipAddress = /((\w.\w+)(\.|\(dot\))(.\w+)([^\s]+)?)/gi;

  if (msg.channel.id == '421155781581340682') {
    if (
      inviteRegex.test(msg.content) ||
      ipAdvertising.test(msg.content) ||
      ipAddress.test(msg.content)
    ) {
      var trigger = [];
      var resume = false;

      if (msg.content.match(ipAdvertising)) {
        let res = Array.from(msg.content.match(ipAdvertising));
        trigger.push(...res);
        resume = true;
      }
      if (msg.content.match(inviteRegex) && !msg.content.includes('https://discord.gg/BWQj987')) {
        let res = Array.from(msg.content.match(inviteRegex));
        trigger.push(...res);
        resume = true;
      }

      if (
        msg.content.match(ipAddress) &&
        !msg.content.match(ipAdvertising) &&
        !msg.content.includes('justminecraft.net')
      ) {
        let res = Array.from(msg.content.match(ipAddress));
        checkIfIp(msg, args, res, trigger);
      }

      if (resume == true) {
        sendAdvertisingMsg(msg, args, trigger);
      }
    }
    antispam.check(msg);
    antiFacny.check(msg);
    antiCaps.check(msg);
    antiChar.check(msg);
  } else {
    if (!msg.webhookID && msg.guild.id == '295429838041382912') {
      if (
        inviteRegex.test(msg.content) ||
        ipAdvertising.test(msg.content) ||
        ipAddress.test(msg.content)
      ) {
        var trigger = [];
        var resume = false;

        if (msg.content.match(ipAdvertising)) {
          let res = Array.from(msg.content.match(ipAdvertising));
          trigger.push(...res);
          resume = true;
        }
        if (msg.content.match(inviteRegex) && !msg.content.includes('https://discord.gg/BWQj987')) {
          let res = Array.from(msg.content.match(inviteRegex));
          trigger.push(...res);
          resume = true;
        }

        if (
          msg.content.match(ipAddress) &&
          !msg.content.match(ipAdvertising) &&
          !msg.content.includes('justminecraft.net')
        ) {
          let res = Array.from(msg.content.match(ipAddress));
          checkIfIp2(msg, args, res, trigger);
        }

        if (resume == true) {
          sendAdvertisingMsg(
            msg,
            ['Discord', msg.author.username + '#' + msg.author.discriminator],
            trigger
          );
          msg.delete();
          msg.channel.send(msg.member.displayName + ', do not advertise please.').then((delmsg) => {
            delmsg.delete({ timeout: 10000 });
          });
        }
      }
    }
  }

  if (msg.content.startsWith(config.prefix)) {
    switch (args[0]) {
      case 'mc': {
        if (args[1] === 'lookup') {
          nameToUUID.data.getUUIDNames(args[2], msg);
        }
        if (args[1] === 'uuid') {
          nameToUUID.data.getUUID(args[2], msg);
        }
        if (args[1] === 'skull') {
          if (!args[2] || !args[3]) return msg.channel.send('!mc skull <url> <name of skull>');
          var url = args[2];
          args.splice(0, 3);
          var name = args.join(' ');
          return generateSkull(name, url, msg);
        }
        if (msg.channel.parentID == '414202025740337152') {
          if (args[1] === 'ban') {
            if (args[2] == undefined || args[3] == undefined || args[4] == undefined)
              return msg.channel
                .send('> !mc ban <server> <username> <time|p|perm> <reason>')
                .then((msg) => {
                  msg.delete({ timeout: 10000 });
                });
            let server = args[2];
            let username = args[3];
            let time = args[4];
            args.splice(0, 5);
            let reason = args.join(' ');
            reason = reason.replace(/(\r\n|\n|\r)/gm, ' ');
            bans.data.addBan(server, username, time, reason, msg);
            return;
          }
          if (args[1] === 'kick') {
            if (args[2] == undefined || args[3] == undefined)
              return msg.channel.send('> !mc kick <server> <username> <reason>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let server = args[2];
            let username = args[3];
            args.splice(0, 4);
            let reason = args.join(' ');
            reason = reason.replace(/(\r\n|\n|\r)/gm, ' ');
            bans.data.addKick(username, server, reason, msg);
            return;
          }
          if (args[1] === 'mute') {
            if (args[2] == undefined || args[3] == undefined)
              return msg.channel.send('> !mc mute <username> <reason>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let username = args[2];
            args.splice(0, 3);
            let reason = args.join(' ');
            reason = reason.replace(/(\r\n|\n|\r)/gm, ' ');
            bans.data.addMute(username, reason, msg);
            return;
          }
          if (args[1] == 'warn') {
            if (args[2] == undefined || args[3] == undefined || args[4] == undefined)
              return msg.channel.send('> !mc warn <server> <username> <reason>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let server = args[2];
            let username = args[3];
            args.splice(0, 4);
            let reason = args.join(' ');
            reason = reason.replace(/(\r\n|\n|\r)/gm, ' ');
            bans.data.addWarn(server, username, reason, msg);
            return;
          }
          if (args[1] === 'bans') {
            if (args[2] == undefined)
              return msg.channel.send('> !mc bans <username>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let username = args[2];
            bans.data.getBans(username, msg);
            return;
          }
          if (args[1] === 'kicks') {
            if (args[2] == undefined)
              return msg.channel.send('> !mc kicks <username>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let username = args[2];
            bans.data.getKicks(username, msg);
            return;
          }
          if (args[1] === 'mutes') {
            if (args[2] == undefined)
              return msg.channel.send('> !mc mutes <username>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let username = args[2];
            bans.data.getMutes(username, msg);
            return;
          }
          if (args[1] === 'warns') {
            if (args[2] == undefined)
              return msg.channel.send('> !mc warns <username>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let username = args[2];
            bans.data.getWarns(username, msg);
            return;
          }
          if (args[1] === 'all') {
            if (args[2] == undefined)
              return msg.channel.send('> !mc all <username>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let username = args[2];
            bans.data.getBans(username, msg);
            bans.data.getKicks(username, msg);
            bans.data.getMutes(username, msg);
            bans.data.getWarns(username, msg);
          }
          if (args[1] === 'delete') {
            if (args[2] == undefined || args[3] == undefined)
              return msg.channel.send('> !mc delete <type> <id>').then((msg) => {
                msg.delete({ timeout: 10000 });
              });
            let type = args[2];
            let id = args[3];
            bans.data.delete(type, id, msg);
            return;
          }
        }
        if (args[1] == undefined || args[1] === 'help') {
          msg.channel.send(
            '> **!mc <username>** - Show name history\n' +
              '> **!mc uuid <username>** - Show users uuid\n'
          );
          if (msg.member.permissions.has('BAN_MEMBERS')) {
            msg.channel.send(
              '> **!mc ban <server> <username> <time> <reason>** - add user to ban db\n' +
                '> **!mc bans <username>** - get users bans\n' +
                '> **!mc kick <server> <username> <reason>** - add user to kick db\n' +
                '> **!mc kicks <username>** - get users kicks\n' +
                '> **!mc mute <username> <reason>** - add user to mute db\n' +
                '> **!mc mutes <username>** - get users mutes\n' +
                '> **!mc warn <server> <username> <reason>** - add user to warn db\n' +
                '> **!mc warns <username>** - get users warns\n' +
                '> **!mc all <username>** - get users bans, kicks, mutes, warns (warn: spam)\n' +
                '> **!mc delete <type> <id>** - delete from db\n\n' +
                '> Time examples: *normal bans: 1d, 4d... | perm bans: p, perm, or permanent*'
            );
          }
        } else if (args[2] == undefined) {
          nameToUUID.data.getUUIDNames(args[1], msg);
        }
        break;
      }
      case 'online': {
        serverOn('justminecraft.net', 25565, (serverName, data) => {
          if (data.online) {
            msg.channel.send('JustMinecraft is online with ' + data.players.now + ' players on.');
          } else {
            msg.channel.send('JustMinecraft is offline! status: `' + data.status + '`');
          }
        });
        break;
      }
      case 'help': {
        msg.channel.send(
          '> **!mc <username>** - Show name history\n' +
            '> **!mc uuid <username>** - Show users uuid\n' +
            '> **!online** - Show if server is online, and amount of players on.'
        );
        break;
      }
      case 'e': {
        if (msg.member.hasPermission('BAN_MEMBERS')) {
          if (enabled == 0) {
            enabled = 1;
          } else {
            enabled = 0;
          }
          msg.reply(enabled).then((mms) => {
            mms.delete({ timeout: 1000 });
          });
          msg.delete();
        }
        break;
      }
    }
  }

  if (msg.channel.id == '771040254466588723') {
    if (msg.author.bot) return;
    let msgChannel = arg[0];
    const sendChannel = client.guilds.cache
      .get('295429838041382912')
      .channels.cache.find((channel) => channel.name === msgChannel);
    let msgText = arg.slice(1).join(' ');
    if (!msgText || !sendChannel) return msg.react('❌');
    if (staffCatagories.includes(sendChannel.parentID) && !msg.member.hasPermission('BAN_MEMBERS'))
      return msg.react('❌');
    //console.log(sendChannel);
    sendChannel.send(msgText);
    msg.react('✅');
    //msg.reply(`*${msgText}*\n\n was sent to ${msgChannel}`);
  }
});

function getUsername(id) {
  return client.guilds.cache.get('295429838041382912').members.cache.get(id).displayName;
}

function uuidDash(uuid) {
  if (!uuid || uuid == undefined) {
    return 'Undefined';
  } else {
    return (
      uuid.substr(0, 8) +
      '-' +
      uuid.substr(8, 4) +
      '-' +
      uuid.substr(12, 4) +
      '-' +
      uuid.substr(16, 4) +
      '-' +
      uuid.substr(20)
    );
  }
}

function generateSkull(name, url, msg) {
  var toEncrypt = '{"textures":{"SKIN":{"url":"' + url + '"}}}';
  var encryptedUrl = Buffer.from(toEncrypt).toString('base64');
  var giveCmd =
    '/give @p player_head{SkullOwner:{Id:"314d6164-6520-6279-2052-756e61696963",Name:"' +
    name +
    '",Properties:{textures:[{Value:"' +
    encryptedUrl +
    '"}]}}}';
  msg.channel.send('`' + giveCmd + '`');
}

var modules = {
  unknownUser: function (name, msg) {
    msg.channel.send(name + ' is unknown');
  },
  returnID: function (name, id, msg) {
    msg.channel.send(`**${name}**'s UUID is:\n> **${uuidDash(id)}**\n\n> **${id}**`);
  },
  returnNames: function (names, msg) {
    msg.channel.send(names);
  },
  noEntries: function (name, msg) {
    msg.channel.send(name + ' has no records in the database.');
  },
  wasError: function (err, msg) {
    msg.channel.send('was error ;-;\n' + '`' + err + '`');
  },
  success: function (msg) {
    msg.react('✅');
  },
  sendOtherMsg: function (message, msg) {
    msg.channel.send(message).then((msg) => {
      msg.delete({ timeout: 10000 });
    });
  },
};
exports.data = modules;

function spamUser(user, member, message) {
  if (client.spamMap.has(user.id)) {
    user.send(
      '`' +
        message +
        '` -' +
        member.displayName +
        '\n Send a message in the JM discord to stop the spam.'
    );
    if (client.spamMap.has(user.id)) {
      setTimeout(() => {
        spamUser(user, member, message);
      }, 10000);
    }
  }
}

client.login(config.token);
