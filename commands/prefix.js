const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const prefixs = new db.table("prefixs");

module.exports = {
  name: "prefix",
  aliases: ["pf"],
  admin:"true",
  args:["No args | New prefix"],
  opt : [0],
  description: "Change guild prefix",
  async execute(msg,args) {
    if ( args[0]=='' ){
        let cpf = (prefixs.get(`guild_${msg.guild.id}`))? prefixs.get(`guild_${msg.guild.id}`) : msg.client.prefix ;
        let prefixEmbed = new MessageEmbed()
        .setTitle("One Of Us prefix | display")
        .setDescription(msg.guild.name)
        .setColor("#F8AA2A")
        .addField(
          '**Current prefix is ``'+cpf+'``**',
          `a`,
          false
        );
        prefixEmbed.setTimestamp();        
        return msg.channel.send(prefixEmbed).catch(console.error);
    }

    prefixs.set(`guild_${msg.guild.id}`,args[0]);
    
    let prefixEmbed = new MessageEmbed()
      .setTitle("One Of Us prefix | change")
      .setDescription(msg.guild.name)
      .setColor("#00FF00")
      .addField(
        '**Prefix changed to **',
        '``'+args[0]+'``',
        true
      );
    prefixEmbed.setTimestamp();

    return msg.channel.send(prefixEmbed).catch(console.error);
  }
};
