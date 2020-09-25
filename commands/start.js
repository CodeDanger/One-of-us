const { MessageEmbed } = require("discord.js");
const { isPremium,startGame,getPendingUsers } = require("../includes/GameManager.js");
const { MAX_ROOMS,MAX_ROUNDS,MIN_PLAYERS } = require("../config.json");

module.exports = {
  name: "start",
  aliases: ["s"],
  admin:"true",
  args:["rooms |max normal:"+MAX_ROOMS+" premium : unlimted" , "rounds |max normal:"+MAX_ROUNDS+" premium: unlimted"],
  description: "Start one of us game",
  async  execute(msg,args) {
    let startmsg = new MessageEmbed(); 

    if (! await isPremium(msg.guild.id)){

        if( parseInt( args[0] ) > MAX_ROOMS ){

          startmsg.setTitle("One Of Us Error Start | Game")
          .setDescription(msg.guild.name)
          .setColor("#FF0000")
          .addField(
            '**Error**',
            '``Max rooms for free version : '+MAX_ROOMS+'``',
            true
          );
        startmsg.setTimestamp();

        return msg.channel.send(startmsg).catch(console.error);
        }

        if( parseInt( args[1] ) > MAX_ROUNDS ){

          startmsg.setTitle("One Of Us Error Start | Game")
          .setDescription(msg.guild.name)
          .setColor("#FF0000")
          .addField(
            '**Error**',
            '``Max rounds for free version : '+MAX_ROUNDS+'``',
            true
          );
        startmsg.setTimestamp();

        return msg.channel.send(startmsg).catch(console.error);
        }
    }

    let pending = await getPendingUsers(msg.guild.id);

    if( !pending || pending.length < MIN_PLAYERS ){

      startmsg.setTitle("One Of Us Error Start | Game")
      .setDescription(msg.guild.name)
      .setColor("#FF0000")
      .addField(
        '**Error**',
        '``You need at least '+MIN_PLAYERS+' players to start the game``',
        true
      );

      startmsg.setTimestamp();

      return msg.channel.send(startmsg).catch(console.error);
    }

    startmsg.setTitle("One Of Us Game | Start")
    .setDescription(msg.guild.name)
    .setColor("#F8AA2A")
    .addField(
      '**Request game to start**',
      '-*The participant list : *',
      false
    );
    
    pending.forEach(element => {
      startmsg.addField(
        `**${msg.guild.members.cache.get(element).user.tag}**`,
        '----------------------------',
        false
      );
    });

  startmsg.setTimestamp();
  msg.channel.send(startmsg).catch(console.error);
  await startGame(msg , args[0] , args[1] );
  return;
  }
};
