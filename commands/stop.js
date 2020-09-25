const { MessageEmbed } = require("discord.js");
const { stopGame,isGameRuning,getGameMainChannel } = require("../includes/GameManager.js");

module.exports = {
  name: "stop",
  aliases: ["sto"],
  admin:"true",
  description: "Stop one of us game",
  async execute(msg,args) {
    
    if(await isGameRuning(msg.guild.id))
    {
      if (await getGameMainChannel(msg.guild.id)!=msg.channel)
      {
        let stopga = new MessageEmbed()
        .setTitle("One Of Us Game | Stop")
        .setDescription(msg.guild.name)
        .setColor("#FF0000")
        .addField(
          '**Error**',
          '``Please write command in the same channel you started game in``',
          true
        )
        .setTimestamp();
        return await msg.channel.send(stopga).catch(console.error);
    
      }

      await stopGame(msg);

    }else{
      let stopga = new MessageEmbed()
      .setTitle("One Of Us Game | Stop")
      .setDescription(msg.guild.name)
      .setColor("#FF0000")
      .addField(
        '**Error**',
        '``Game is not running``',
        true
      )
      .setTimestamp();
      return await msg.channel.send(stopga).catch(console.error);
  
    }

  }
};
