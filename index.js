const Discord = require('discord.js');
const client = new Discord.Client();
var enabled = 1;
client.on('ready', () => {
    console.log(`Slimejamm is online`);
    enabled = 1;
    console.log('slimejamm is now ON');});
client.on('message', msg => {
    if(msg.content === '!ssj on'){
        if(!msg.member.hasPermission('MUTE_MEMBERS')){msg.react('❌'); return;}
        enabled = 1;
        console.log('slimejamm is now ON');
        msg.react('✅');}
    if(msg.content === 'ssj off'){
        if(!msg.member.hasPermission('MUTE_MEMBERS')){msg.react('❌'); return;}
        enabled = 0;
        console.log('slimejamm is now OFF');
        msg.react('✅');}
    if(!enabled == 1){return};
    if(!msg.member.roles.cache.has("721622447756935208")){return};
    msg.react('707263484035072000');
    if(message.author.bot) return;
    let smsg = msg.content.toLocaleLowerCase();
    let sender= msg.member.displayName;
    let senderm = msg.members;
    let KK964 = client.users.cache.get('426892116258717707')
    var kk = ["kk"]
    for (x = 0; x < kk.length; x++) {
        if (smsg.includes(kk[x])){
            KK964.send(`${sender} says ${smsg}.`)
        }
    }
});
client.login(process.env.token);