const Discord = require('discord.js');
const client = new Discord.Client();
var enabled = 1;
client.on('ready', () => {
    console.log(`Slimejamm is online`);
    enabled = 1;
    console.log('slimejamm is now ON');});
client.on('message', msg => {
    if(msg.content === '!ssj on'){
        if(!msg.member.cache.roles.has("295432346927104000")){msg.react('❌'); return;}
        enabled = 1;
        console.log('slimejamm is now ON');
        msg.react('✅');}
    if(msg.content === 'ssj off'){
        if(!msg.member.cache.roles.has("295432346927104000")){msg.react('❌'); return;}
        enabled = 0;
        console.log('slimejamm is now OFF');
        msg.react('✅');}
    if(enabled !== 1){return};
    if(!msg.member.cache.roles.has("721622447756935208")){return};
    msg.react('707263484035072000');});
client.login(process.env.token);