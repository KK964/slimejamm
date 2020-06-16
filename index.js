const Discord = require('discord.js');
const client = new Discord.Client();
var enabled = 1;
client.on('ready', () => {
    console.log(`Slimejamm is online`);
    enabled = 1;
    console.log('slimejamm is now ON');});
client.on('message', msg => {
    if(msg.channel.id == '615023024260775946') {
        msg.react('✅')
        .then(msg.react('❌'));
    }
    if(msg.content === '!ssj on'){
        if(!msg.member.hasPermission('MUTE_MEMBERS')){msg.react('❌'); return;}
        enabled = 1;
        console.log('slimejamm is now ON');
        msg.react('✅');}
    if(msg.content === '!ssj off'){
        if(!msg.member.hasPermission('MUTE_MEMBERS')){msg.react('❌'); return;}
        enabled = 0;
        console.log('slimejamm is now OFF');
        msg.react('✅');}
    if(msg.webhookID){return};
    if(msg.channel.type === 'dm'){return};
    if(msg.author == null){return};
    if(!enabled == 1){return};
    if(!msg.member.roles.cache.has("721622447756935208")){return};
    msg.react('707263484035072000');
});
client.login(process.env.token);