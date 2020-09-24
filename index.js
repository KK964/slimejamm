require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
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
  client.user
    .setPresence({
      activity: { name: '"!ssj results" for sim results' },
      status: 'online',
    })
    .then(console.log)
    .catch(console.error);
});
client.on('message', (msg) => {
  if (msg.channel.id == '615023024260775946') {
    if (msg.member.user.bot) {
      return;
    }
    msg.react('758701455766323202').then(msg.react('758701482248896552'));
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
          '**1. SubieBerry**: 9.8/10\n' +
          '**2. Dovyeon**: 9.0\n' +
          '**3. PureGero**: 8.7/10\n' +
          '**4. null**: 8.2/10\n' +
          '**5. [Myth] [HC] [0] +DaOrdinary**: 7.1/10\n' +
          '**6. RJAE507**: 5.2/10\n' +
          '**7. greenteacups**: 3.1/10\n' +
          '**8. PureBot**: 2.2/10\n' +
          '**9. SlushyCats**: 1.0/10\n' +
          '**10. RaphyRod8055**: 0.2/10\n',
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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

client.login(config.token);
