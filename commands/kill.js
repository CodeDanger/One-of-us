const { MessageEmbed } = require("discord.js");
const { isGameRuning,killPlayer,isKiller,isKillingChannel,isPlayerLive,isPlayer,getExpose } = require("../includes/GameManager.js");

module.exports = {
  name: "kill",
  aliases: ["k"],
  admin:"false",
  cooldown:10,
  description: "kill player in one of us game",
  async  execute(msgo,args) {

      let msg = msgo;
      setTimeout((a)=>{a.delete()},1000,msgo);
    
      if (await isGameRuning(msg.guild.id) && await isPlayer(msg.guild.id,msg.author.id) && await isKiller(msg.guild.id,msg.author.id) )
    {
      let msgkill = new MessageEmbed();
        if(await getExpose(msg.guild.id)==true){

            msgkill.setTitle("One Of Us Error Kill | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``Wait until voting is finish``',
              true
            )
            .setTimestamp();
            return msg.channel.send(msgkill).catch(console.error);
        }


        if (!isKillingChannel(msg.guild.id,msg.channel)){
            msgkill.setTitle("One Of Us Error Kill | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``Please use killing rooms``',
              true
            )
            .setTimestamp();
            return msg.channel.send(msgkill).catch(console.error);
        }

        if (!msg.mentions.users || !msg.mentions.users.size==1){
            msgkill.setTitle("One Of Us Error Kill | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``Please mention to the player you want to kill``',
              true
            )
            .setTimestamp();
            return msg.channel.send(msgkill).catch(console.error);
        }

        if (! await isPlayerLive(msg.guild.id,msg.guild.id,msg.mentions.users.first().id) )
        {
          msgkill.setTitle("One Of Us Error Kill | Game")
          .setDescription(msg.guild.name)
          .setColor("#FF0000")
          .addField(
            '**Error**',
            '``The player is already dead``',
            true
          )
          .setTimestamp();
          return msg.channel.send(msgkill).catch(console.error);          
        }

        if(! await isPlayer(msg.guild.id,msg.mentions.users.first().id) )
        {
            msgkill.setTitle("One Of Us Error Kill | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``Only players can be killed``',
              true
            )
            .setTimestamp();
            return msg.channel.send(msgkill).catch(console.error);
        }

        await killPlayer(msg,msg.mentions.users.first().id);
    }
  }
};
