const { MessageEmbed } = require("discord.js");
const { isPremium,addPendingUser,getPendingUsers } = require("../includes/GameManager.js");
const { MAX_PLAYERS } = require("../config.json");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


module.exports = {
  name: "addplayer",
  aliases: ["ap"],
  admin:"true",
  args:["players mentions unlimited"],
  description: "Add player to list",
  async  execute(msg,args) {

    let addmsg = new MessageEmbed(); 
    let pending = await getPendingUsers(msg.guild.id);

    if (!isPremium(msg.guild.id) && pending!=null ){

        if( (pending.length+1) > MAX_PLAYERS || msg.mentions.users.size > MAX_PLAYERS ){

          addmsg.setTitle("One Of Us Error Add player | Game")
          .setDescription(msg.guild.name)
          .setColor("#FF0000")
          .addField(
            '**Error**',
            '``Max players for free version : '+MAX_PLAYERS+'``',
            true
          )
        .setTimestamp();

        return msg.channel.send(addmsg).catch(console.error);
        }

      
    }

    for( var element of msg.mentions.users.values() )
    { 
      pending = await getPendingUsers(msg.guild.id);
      if(!pending || !pending.includes(element.id)){
        await addPendingUser( msg.guild.id , element.id );  
      }
    }

    pending = await getPendingUsers(msg.guild.id);

    addmsg.setTitle("One Of Us Add Player | Game")
    .setDescription(msg.guild.name)
    .setColor("#F8AA2A")
    .addField(
      '**Add player success **',
      '-**The participant list : **',
      false
    );
    
    pending.forEach(element => {
        addmsg.addField(
        `**${msg.guild.members.cache.get(element).user.tag}**`,
        '----------------------------',
        false
      );
    });

  addmsg.setTimestamp();
  msg.channel.send(addmsg).catch(console.error);
  return;
  }
};
