require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const randEmoji = require('./randEmoji');
const bans = require('./minecraft/banDB');
const conf = require('./cfg.json');

client.spamMap = new Map();

//Minecraft stuff
const nameToUUID = require('./minecraft/nameUUID');
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
});

var staffCatagories = ['409367358721884170', '414202025740337152'];

client.on('message', (msg) => {
  let args = msg.content.substring(config.prefix.length).split(' ');
  let arg = msg.content.split(' ');
  if (msg.channel.id == '615023024260775946') {
    if (msg.member.user.bot) return;
    msg.react('✅').then(msg.react('❌'));
  }
  if (client.spamMap.has(msg.member.id)) {
    if (msg.member) client.spamMap.delete(message.member.id);
  }
  if (msg.content.startsWith(config.prefix)) {
    switch (args[0]) {
      case 'other': {
        if (args[1] === 'spam') {
          if (!member.hasPermission('BAN_MEMBERS')) return;
          var member = msg.guild.member(message.mentions.users.first());
          args.splice(0, 2);
          var reason = args.join(' ');
          if (!member || reason) return msg.channel.send('That is not how to use that command');
          client.spamMap.set(member.id);
          msg.channel.send('Started spamming member with ' + reason);
          spamUser(member, msg.member, reason);
          return;
        }
      }
      case 'ssj': {
        if (args[1] === 'on') {
          if (!msg.member.hasPermission('MUTE_MEMBERS')) {
            msg.react('❌');
            return;
          }
          enabled = 1;
          console.log('SlimeSpider is now ON');
          msg.react('✅');
          client.user
            .setPresence({
              activity: { name: 'shipping berry and sj' },
              status: 'online',
            })
            .then(console.log)
            .catch(console.error);
        }
        if (args[1] === 'off') {
          if (!msg.member.hasPermission('MUTE_MEMBERS')) {
            msg.react('❌');
            return;
          }
          enabled = 0;
          console.log('SlimeSpider is now OFF');
          msg.react('✅');
          client.user
            .setPresence({ activity: { name: 'nothing ;-;' }, status: 'idle' })
            .then(console.log)
            .catch(console.error);
        }
      }
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
            '> **!mc lookup <username>** - Show name history\n' +
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
      }
    }
  }

  if (msg.webhookID || msg.channel.type === 'dm' || msg.author == null || enabled != 1) return;

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
  user.send('`' + message + '` -' + member.displayName + '\n Reply to this to stop the spam.');
  if (client.spamMap.has(user.id)) {
    setTimeout(() => {
      spamUser(user, member, message);
    }, 10000);
  } else return;
}

client.login(config.token);
