const { MessageEmbed } = require("discord.js");
const { isGameRuning,resetPending,getPendingUsers } = require("../includes/GameManager.js");

module.exports = {
  name: "resetplayers",
  aliases: ["rp"],
  admin:"true",
  description: "Rest all game players",
  async  execute(msg,args) {
    
    let resetmsg = new MessageEmbed(); 

    if (await isGameRuning(msg.guild.id) )
    {
        resetmsg.setTitle("One Of Us Error Reset | Game")
        .setDescription(msg.guild.name)
        .setColor("#FF0000")
        .addField(
          '**Error**',
          '``The game is running``',
          true
        )
        .setTimestamp();
        return msg.channel.send(resetmsg).catch(console.error);
    }

    let pending = await getPendingUsers(msg.guild.id);


    if( !pending || pending.length == 0 ){
        resetmsg.setTitle("One Of Us Error Reset | Game")
        .setDescription(msg.guild.name)
        .setColor("#FF0000")
        .addField(
          '**Error**',
          '``There is no player added to game``',
          true
        )
        .setTimestamp();
        return msg.channel.send(resetmsg).catch(console.error);
    }

    resetmsg.setTitle("One Of Us Reset | Game")
    .setDescription(msg.guild.name)
    .setColor("#F8AA2A")
    .addField(
      '**Error**',
      '``The game is running``',
      true
    )
    .setTimestamp();
    await msg.channel.send(resetmsg).catch(console.error);

  await resetPending(msg.guild.id );
  return;
  }
};
