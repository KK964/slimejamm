require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const randEmoji = require('./randEmoji');
const bans = require('./minecraft/banDB');
const conf = require('./cfg.json');

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
  const serverQueue = queue.get(client.guilds.cache.get('295429838041382912').id);
  if (msg.channel.id == '615023024260775946') {
    if (msg.member.user.bot) return;
    msg.react('✅').then(msg.react('❌'));
  }
  if (msg.content.startsWith(config.prefix)) {
    switch (args[0]) {
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
        if (args[1] === `results`) {
          const rankEmbed = new Discord.MessageEmbed()
            .setColor('#fcba03')
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTitle('SJ Shipping Sim Results')
            .addFields({
              name: 'Results',
              value:
                `**1. ${getUsername('295483724429262848')}**: 9.8/10\n` +
                `**2. ${getUsername('295279743480365066')}**: 9.0\n` +
                `**3. ${getUsername('276543437241843713')}**: 8.7/10\n` +
                `**4. null**: 8.2/10\n` +
                `**5. ${getUsername('202873006773633024')}**: 7.1/10\n` +
                `**6. ${getUsername('554128619635736601')}**: 5.2/10\n` +
                `**7. ${getUsername('268365742636793856')}**: 3.1/10\n` +
                `**8. ${getUsername('728442617498566666')}**: 2.2/10\n` +
                `**9. ${getUsername('635699957080260632')}**: 1.0/10\n` +
                `**10. ${getUsername('718860903793164450')}**: 0.2/10\n`,
            });
          msg.author.send(rankEmbed).catch(() => {
            msg.react('❌');
            return;
          });
          msg.react('756694775436148816');
        }
      }
      case 'mc': {
        if (args[1] === 'lookup') {
          nameToUUID.data.getUUIDNames(args[2], msg);
        }
        if (args[1] === 'uuid') {
          nameToUUID.data.getUUID(args[2], msg);
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
            bans.data.addBan(server, username, time, reason, msg);
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
                '> **!mc mute <username> <reason>** - add user to mute db\n' +
                '> **!mc mutes <username>** - get users mutes\n' +
                '> **!mc warn <server> <username> <reason>** - add user to warn db\n' +
                '> **!mc warns <username>** - get users warns\n' +
                '> **!mc all <username>** - get users bans, mutes, warns\n' +
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

client.login(config.token);
