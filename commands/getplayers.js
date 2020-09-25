const { MessageEmbed } = require("discord.js");
const { isGameRuning,getPendingUsers } = require("../includes/GameManager.js");

module.exports = {
  name: "getplayers",
  aliases: ["gp"],
  admin:"true",
  description: "Start one of us game",
  async  execute(msg,args) {

    let getmsg = new MessageEmbed(); 

    if (await isGameRuning(msg.guild.id) )
    {
        getmsg.setTitle("One Of Us Error Get players | Game")
        .setDescription(msg.guild.name)
        .setColor("#FF0000")
        .addField(
          '**Error**',
          '``The game is running``',
          true
        )
        .setTimestamp();
        return msg.channel.send(getmsg).catch(console.error);
    }

    let pending = await getPendingUsers(msg.guild.id);

    if( !pending || pending.length == 0 ){
        getmsg.setTitle("One Of Us Error Reset | Game")
        .setDescription(msg.guild.name)
        .setColor("#FF0000")
        .addField(
          '**Error**',
          '``There is no player added to game``',
          true
        )
        .setTimestamp();
        return msg.channel.send(getmsg).catch(console.error);
    }


    getmsg.setTitle("One Of Us Game | Start")
    .setDescription(msg.guild.name)
    .setColor("#F8AA2A")
    .addField(
      '**Request players list**',
      '-*The participant list : *',
      false
    );
    pending.forEach(element => {
      getmsg.addField(
        `**${msg.guild.members.cache.get(element).user.tag}**`,
        '----------------------------',
        false
      );
    });

  getmsg.setTimestamp();
  await msg.channel.send(getmsg).catch(console.error);
  return;
  }
};
