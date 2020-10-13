require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const wait = require('util').promisify(setTimeout);
require('dotenv-flow').config();
const randEmoji = require('./randEmoji');
const conf = require('./cfg.json');
const config = {
  token: process.env.TOKEN,
};
var enabled = 1;
client.on('ready', () => {
  console.log(`SlimeSpider is online`);
  enabled = 1;
  console.log('SlimeSpider is now ON');
  wait(1000);
  client.user.setPresence({activity:{name:"Sj's and berry's date", type:"STREAMING", url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, status:'online'});
});
client.on('message', (msg) => {
  if (msg.channel.id == '615023024260775946') {
    if (msg.member.user.bot) {
      return;
    }
    msg.react('✅').then(msg.react('❌'));
  }
  if (msg.content === '!ssj on') {
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
  if (msg.content === '!ssj off') {
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
  if (msg.content === `!ssj results`) {
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

  if (msg.webhookID) {
    return;
  }
  if (msg.channel.type === 'dm') {
    return;
  }
  if (msg.author == null) {
    return;
  }
  if (!enabled == 1) {
    return;
  }
  if (msg.member.roles.cache.has('721622447756935208')) {
    if (
      msg.channel.id == '615023024260775946' ||
      msg.channel.id == '459506938154057732'
    ) {
      return;
    }
    msg.react('707263484035072000');
    if (getRandomInt(100) == 74) {
      msg.react(randEmoji.data.getEmoji());
    }
  }
});
function getUsername(id) {
  return client.guilds.cache.get('295429838041382912').members.cache.get(id)
    .displayName;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

client.login(config.token);
