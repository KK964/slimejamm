require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
require('dotenv-flow').config();
const randEmoji = require('./randEmoji');
const bans = require('./minecraft/banDB');
const conf = require('./cfg.json');
const ms = require('ms');
const { send } = require('process');

//Minecraft stuff
const nameToUUID = require('./minecraft/nameUUID');
const { isUndefined } = require('util');
//

//

//

//

const config = {
  token: process.env.TOKEN,
  prefix: '!',
};
const queue = new Map();

var sfx = ['man-scream-01', 'fnaf', 'fart', 'yeahbb'];

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
  //const channel = console.log(client.guilds.cache.get('295429838041382912').channels.cache.get('713215253160263732'));
  /*client.guilds.cache
    .get('295429838041382912')
    .channels.cache.get('295429838041382912')
    .stopTyping();
  client.guilds.cache
    .get('295429838041382912')
    .channels.cache.get('618072477674897409')
    .send('failed to ban... invalid perms');*/
  //client.guilds.cache.get('295429838041382912').channels.cache.get('763857263798517761').setName('Chalupa Talk');
});

var staffCatagories = ['409367358721884170', '414202025740337152'];

client.on('message', (msg) => {
  let args = msg.content.substring(config.prefix.length).split(' ');
  let arg = msg.content.split(' ');
  const serverQueue = queue.get(client.guilds.cache.get('295429838041382912').id);
  if (msg.channel.id == '615023024260775946') {
    if (msg.member.user.bot) {
      return;
    }
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

        if (args[1] === 'test') {
          ratweewee(getRandomSfx(), msg.member, serverQueue);
        }
      }
      case 'mc': {
        if (args[1] === 'lookup') {
          nameToUUID.data.getUUIDNames(args[2], msg);
        }
        if (args[1] === 'uuid') {
          nameToUUID.data.getUUID(args[2], msg);
        }
        if (args[1] === 'ban') {
          if (!msg.member.permissions.has('BAN_MEMBERS')) return msg.react('❌');
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
          if (!msg.member.permissions.has('BAN_MEMBERS')) return msg.react('❌');
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
          if (!msg.member.permissions.has('BAN_MEMBERS')) return msg.react('❌');
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
          if (!msg.member.permissions.has('BAN_MEMBERS')) return msg.react('❌');
          if (args[2] == undefined)
            return msg.channel.send('> !mc bans <username>').then((msg) => {
              msg.delete({ timeout: 10000 });
            });
          let username = args[2];
          bans.data.getBans(username, msg);
          return;
        }
        if (args[1] === 'mutes') {
          if (!msg.member.permissions.has('BAN_MEMBERS')) return msg.react('❌');
          if (args[2] == undefined)
            return msg.channel.send('> !mc mutes <username>').then((msg) => {
              msg.delete({ timeout: 10000 });
            });
          let username = args[2];
          bans.data.getMutes(username, msg);
          return;
        }
        if (args[1] === 'warns') {
          if (!msg.member.permissions.has('BAN_MEMBERS')) return msg.react('❌');
          if (args[2] == undefined)
            return msg.channel.send('> !mc warns <username>').then((msg) => {
              msg.delete({ timeout: 10000 });
            });
          let username = args[2];
          bans.data.getWarns(username, msg);
          return;
        }
        if (args[1] === 'delete') {
          if (!msg.member.permissions.has('BAN_MEMBERS')) return msg.react('❌');
          if (args[2] == undefined || args[3] == undefined)
            return msg.channel.send('> !mc delete <type> <id>').then((msg) => {
              msg.delete({ timeout: 10000 });
            });
          let type = args[2];
          let id = args[3];
          bans.data.delete(type, id, msg);
          return;
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

  if (msg.member.roles.cache.has('721622447756935208')) {
    if (msg.channel.id == '615023024260775946' || msg.channel.id == '459506938154057732') {
      return;
    }
    msg.react('707263484035072000');
    if (getRandomInt(100) == 74) {
      msg.react(randEmoji.data.getEmoji());
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

client.on('voiceStateUpdate', (oldMember, newMember) => {
  const serverQueue = queue.get(client.guilds.cache.get('295429838041382912').id);
  let newUserChannel = newMember.member.voice.channel;
  if (newMember.member.voice.channelID != '763857263798517761') {
    if (getRandomInt(25) != 5) return;
  }
  if (newUserChannel) {
    if (
      (newMember.mute && !oldMember.mute) ||
      (newMember.selfDeaf && !oldMember.selfDeaf) ||
      (newMember.selfMute && !oldMember.selfMute) ||
      (newMember.serverDeaf && !oldMember.serverDeaf) ||
      (newMember.serverMute && !oldMember.serverMute) ||
      (!newMember.mute && oldMember.mute) ||
      (!newMember.selfDeaf && oldMember.selfDeaf) ||
      (!newMember.selfMute && oldMember.selfMute) ||
      (!newMember.serverDeaf && oldMember.serverDeaf) ||
      (!newMember.serverMute && oldMember.serverMute) ||
      (newMember.streaming && !oldMember.streaming) ||
      (!newMember.streaming && oldMember.streaming)
    )
      return;
    ratweewee(getRandomSfx(), newMember.member, serverQueue);
  } else return;
});

function getRandomSfx() {
  const randomsfx = Math.floor(Math.random() * sfx.length);
  return sfx[randomsfx];
}

function getUsername(id) {
  return client.guilds.cache.get('295429838041382912').members.cache.get(id).displayName;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function ratweewee(arg, member, serverQueue) {
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    return;
  }

  if (!serverQueue) {
    const queueContruct = {
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 1,
      playing: true,
    };
    queue.set('295429838041382912'.id, queueContruct);

    queueContruct.songs.push(arg);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play('295429838041382912', queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete('295429838041382912'.id);
      return;
    }
  } else {
    serverQueue.songs.push(arg);
    return;
  }
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(fs.createReadStream(`./audio/${song}.mp3`))
    .on('finish', () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
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
    msg.channel.send(message);
  },
};
exports.data = modules;

client.login(config.token);
