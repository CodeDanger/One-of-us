const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  aliases: ["cl"],
  admin:"true",
  args:["No args | 0-99"],
  opt : [0],
  description: "Clear channel Messages",
  async execute(msg,args) {

    let num = args[0]!="" ? args[0] : 100;   

    msg.channel.bulkDelete(num).then(() => {
  
        let prefixEmbed = new MessageEmbed()
        .setTitle("One Of Us clear | "+num)
        .setDescription(msg.guild.name)
        .setColor("#00FF00")
        .addField(
          '**Chat cleared**',
          '\u200B',
          true
        );
        prefixEmbed.setTimestamp();
  
        return msg.channel.send(prefixEmbed).catch(console.error);
    });
    
  }
};
