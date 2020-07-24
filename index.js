require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv-flow").config();
const config = {
    token: process.env.TOKEN
};
var enabled = 1;
client.on('ready', () => {
    console.log(`SlimeSpider is online`);
    enabled = 1;
    console.log('SlimeSpider is now ON');
    client.user.setPresence({ activity: { name: 'is a spider' }, status: 'online' })
    .then(console.log)
    .catch(console.error);
});
client.on('message', msg => {
    if(msg.channel.id == '615023024260775946') {
        if(msg.member.user.bot) {return;}
        msg.react('✅')
        .then(msg.react('❌'));
    }
    if(msg.content === '!ssj on'){
        if(!msg.member.hasPermission('MUTE_MEMBERS')){msg.react('❌'); return;}
        enabled = 1;
        console.log('SlimeSpider is now ON');
        msg.react('✅');
        client.user.setPresence({ activity: { name: 'sj shiping sim' }, status: 'online' })
        .then(console.log)
        .catch(console.error);}
    if(msg.content === '!ssj off'){
        if(!msg.member.hasPermission('MUTE_MEMBERS')){msg.react('❌'); return;}
        enabled = 0;
        console.log('SlimeSpider is now OFF');
        msg.react('✅');
        client.user.setPresence({ activity: { name: 'nothing ;-;' }, status: 'idle' })
        .then(console.log)
        .catch(console.error);}
    if(msg.webhookID){return};
    if(msg.channel.type === 'dm'){return};
    if(msg.author == null){return};
    if(!enabled == 1){return};
    if(msg.member.roles.cache.has("721622447756935208")){
        if(msg.channel.id=='615023024260775946' || msg.channel.id=='459506938154057732') {return};
        msg.react('707263484035072000');
    };
});
client.login(config.token);