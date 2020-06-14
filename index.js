const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log(`Slimejamm is online`);
});
client.on('message', msg => {
    if(!msg.member.roles.cache.has("721622447756935208")){return};
    msg.react('707263484035072000');
});
client.login(process.env.token);//login